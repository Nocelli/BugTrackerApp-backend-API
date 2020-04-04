const connection = require('../database/connection')
const VerifyToken = require('../utils/VerifyToken')
const isTheUserInTheProject = require('../utils/IsTheUserInTheProject')
const knex = require('knex')

module.exports = {
    async addMemberToProject(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {
                const projectId = req.params.projectId
                const { userId, roleId } = req.body
                const loggedUserId = token.DecodedToken.userId
                const loggedUserRoleInProject = await isTheUserInTheProject(projectId, loggedUserId)
                
                //check if the user is not being added as owner
                if (roleId === 1)
                    return res.status(400).json(`There can be only one owner`)

                //check if project exists
                if(loggedUserRoleInProject === undefined)
                    return res.status(404).json(`Project not found.`)
                
                //check if the logged user have invite privileges in the project
                if(loggedUserRoleInProject > 2)
                    return res.status(403).json(`You need to be at least an admin to add members to this project.`)

                //check if the user that are being added isant already in the project
                if (await isTheUserInTheProject(projectId, userId))
                    return res.status(400).json(`User already in project.`)

                await connection('members').insert({
                    user_id: userId,
                    role_id: roleId,
                    project_id: projectId
                })

                return res.status(201).send()
            }
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async listMemberOfProject(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {
                const projectId = req.params.projectId
                const loggedUserId = token.DecodedToken.userId

                if (!(await isTheUserInTheProject(projectId,loggedUserId)))
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
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async kickMember(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {
                const projectId = req.params.projectId
                const { userId } = req.body
                const loggedUserId = token.DecodedToken.userId
                const loggedUserRoleInProject = await isTheUserInTheProject(projectId, loggedUserId)
                const removedUserRoleId = await isTheUserInTheProject(projectId, userId)
             
                //check if project exists
                if(loggedUserRoleInProject === undefined)
                    return res.status(404).json(`Project not found.`)
                
                //check if the logged user have moderating privileges in the project
                if(loggedUserRoleInProject > 2)
                    return res.status(403).json(`You need to be at least an admin to remove members of this project.`)

                //check if the user that are being removed is in the project
                if (!removedUserRoleId)
                    return res.status(400).json(`User not in the project.`)

                //check if the logged user have a higher role than the user being deleted
                if(loggedUserRoleInProject > removedUserRoleId)
                     return res.status(403).json(`You cant remove an user with a role higher than yours.`)
                
                //deleting member
                await await connection('members')
                    .join('projects', { 'members.project_id' : 'projects.id' })
                    .join('users', { 'users.id': 'members.user_id' })
                    .where('members.project_id', projectId) // project exist
                    .where('members.user_id', userId)
                    .delete()

                return res.status(204).send()
            }
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }
}