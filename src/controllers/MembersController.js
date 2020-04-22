const connection = require('../database/connection')
const isTheUserInTheProject = require('../utils/IsTheUserInTheProject')
const GetUserMemberIdInProject = require('../utils/GetUserMemberIdInProject')
const GetUserByEmail = require('../utils/GetUserByEmail')
const knex = require('knex')

module.exports = {

    async sendNotification(req, res) {
        try {
            const { io, users } = require('../socket').getio();
            const projectId = req.params.projectId
            const { userEmail, roleId } = req.body
            const loggedUserId = res.locals.userId
            const loggedUserRoleInProject = await isTheUserInTheProject(projectId, loggedUserId)
            const user = await GetUserByEmail(userEmail)

            //user exists
            if (!user)
                return res.status(404).json({ error: `User not found` })


            //check if the user have been already invited to project
            const notification = await connection('notification')
                .where('user_id', user.id)
                .where('project_id', projectId)
                .select('notification.id')
                .first()

            if (notification)
                return res.status(400).json({ error: `User has already been invited to the project` })

            //check if the user is not being added as owner
            if (roleId === 1)
                return res.status(400).json({ error: `There can be only one owner` })

            //check if project exists
            if (loggedUserRoleInProject === undefined)
                return res.status(404).json({ error: `Project not found.` })

            //check if the logged user have invite privileges in the project
            if (loggedUserRoleInProject > 2)
                return res.status(403).json({ error: `You need to be at least an admin to add members to this project.` })

            //check if the user that are being added isant already in the project
            if (await isTheUserInTheProject(projectId, user.id))
                return res.status(400).json({ error: `User already in project.` })

            await connection('notification').insert({
                date: Math.floor(new Date().getTime() / 1000.0),
                user_id: user.id,
                role_id: roleId,
                project_id: projectId,
                senders_user_id: loggedUserId
            })

            const total = await connection('notification')
                .where('user_id', user.id)
                .count()

            io.to(users[user.id]).emit('FromAPI', total[0].count)
            return res.status(200).send()
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async addMemberToProject(req, res) {
        try {
            const inputIndex = req.params.inputIndex
            const { notificationId } = req.body
            const userId = res.locals.userId
            const notification = await connection('notification').where('notification.id', notificationId).select('*').first()

            if (!notification)
                return res.status(400).json({ error: `Invite not valid.` })

            const projectId = notification.project_id
            const loggedUserRoleInProject = await isTheUserInTheProject(projectId, notification.senders_user_id)

            if (notification.user_id !== userId)
                return res.status(400).json({ error: `This invite was not meant fot you.` })

            if (inputIndex === 'deny') {
                await connection('notification').where('notification.id', notificationId).delete()
                return res.status(200).send()
            }

            //check if project exists
            if (loggedUserRoleInProject === undefined)
                return res.status(404).json({ error: `Project not found.` })

            //check if the user is not being added as owner
            if (notification.role_id === 1)
                return res.status(400).json({ error: `There can be only one owner` })

            //check if the logged user have invite privileges in the project
            if (loggedUserRoleInProject > 2)
                return res.status(403).json({ error: `You need to be at least an admin to add members to this project.` })

            //check if the user that are being added isant already in the project
            if (await isTheUserInTheProject(projectId, userId))
                return res.status(400).json({ error: `User already in project.` })

            await connection('members').insert({
                user_id: userId,
                role_id: notification.role_id,
                project_id: projectId
            })

            await connection('notification')
                .where('id', notificationId)
                .delete()

            return res.status(201).send()
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async listMemberOfProject(req, res) {
        try {
            const projectId = req.params.projectId
            const loggedUserId = res.locals.userId

            if (!(await isTheUserInTheProject(projectId, loggedUserId)))
                return res.status(403).json(`Not enough clearance.`)

            const members = await connection('projects')
                .join('members', { 'projects.id': 'members.project_id' })
                .join('users', { 'users.id': 'members.user_id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('projects.id', projectId) // project exist
                .select(
                    knex.raw(`users.name as "Member-name"`),
                    knex.raw(`roles.name as "role"`),
                )

            return res.json(members)

        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async kickMember(req, res) {
        try {
            const projectId = req.params.projectId
            const userId  = req.params.userId
            const loggedUserId = res.locals.userId
            const loggedUserRoleInProject = await isTheUserInTheProject(projectId, loggedUserId)
            const removedUserRoleId = await isTheUserInTheProject(projectId, userId)
            const memberId = await GetUserMemberIdInProject(projectId, userId)


            if(userId === loggedUserId && loggedUserRoleInProject === 1)
                return res.status(400).json({error :`As the owner you cant leave the project, delete the project instead.`})
            //check if project exists
            if (!loggedUserRoleInProject)
                return res.status(404).json({error :`Project not found.`})

            //check if the logged user have moderating privileges in the project
            if (loggedUserRoleInProject > 2 && userId !== loggedUserId)
                return res.status(403).json({error :`You need to be at least an admin to remove members of this project.`})

            //check if the user that are being removed is in the project
            if (!removedUserRoleId)
                return res.status(400).json({error :`User not in the project.`})

            //check if the logged user have a higher role than the user being deleted
            if (loggedUserRoleInProject > removedUserRoleId && userId !== loggedUserId)
                return res.status(403).json({error :`You cant remove an user with a role higher than yours.`})
            
            //deleting member tickets
            await connection('tickets')
                .where('tickets.member_id', memberId)
                .where('tickets.project_id', projectId)
                .delete()

            //deleting member
            await connection('members')
                .join('projects', { 'members.project_id': 'projects.id' })
                .join('users', { 'users.id': 'members.user_id' })
                .where('members.project_id', projectId) // project exist
                .where('members.user_id', userId)
                .delete()

            return res.status(204).send()
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async changeRole(req, res) {
        try {
            const projectId = req.params.projectId
            const { userId, newRoleId } = req.body
            const loggedUserId = res.locals.userId
            const loggedUserRoleInProject = await isTheUserInTheProject(projectId, loggedUserId)
            const memberUserRoleId = await isTheUserInTheProject(projectId, userId)

            //check if the new role is the 'owner' role
            if (newRoleId === 1)
                return res.status(400).json({ error: `There can be only one owner` })

            //check if project exists
            if (!loggedUserRoleInProject)
                return res.status(404).json({ error: `Project not found.` })

            //check if the logged user have moderating privileges in the project
            if (loggedUserRoleInProject > 2)
                return res.status(403).json({ error: `You need to be at least an admin to change members roles.` })

            //check if the user that are being changed is in the project
            if (!memberUserRoleId)
                return res.status(400).json({ error: `User not in the project.` })

            //check if the logged user have a higher role than the user being changed
            if (loggedUserRoleInProject > memberUserRoleId)
                return res.status(403).json({ error: `You cant change an users role with a role higher than yours.` })

            //changing role ,returns 1 if changed
            if ((
                await connection('members')
                    .join('projects', { 'members.project_id': 'projects.id' })
                    .join('users', { 'users.id': 'members.user_id' })
                    .where('members.project_id', projectId) // project exist
                    .where('members.user_id', userId)
                    .update({ role_id: newRoleId })))
                return res.status(202).send()

            return res.status(304).send()
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ error: err })
        }
    }
}