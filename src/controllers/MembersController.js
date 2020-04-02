const connection = require('../database/connection')
const VerifyToken = require('../utils/VerifyToken')
const knex = require('knex')

module.exports = {
    async addMemberToProject(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {
                const projectId = req.params.projectId
                const { userId, roleId } = req.body
                const loggedUserId = token.DecodedToken.userId

                if (roleId === 1)
                    return res.status(400).json(`There can be only one owner`)

                const project = await connection('projects')
                    .join('members', { 'projects.id': 'members.project_id' })
                    .join('users', { 'users.id': 'members.user_id' })
                    .join('roles', { 'roles.id': 'members.role_id' })
                    .where('roles.id', '<', '3') // user is at least admin
                    .where('users.id', loggedUserId) // user is member of the project
                    .where('projects.id', projectId) // project exist
                    .select('projects.*')
                    .first()


                if (projectId != project.id)
                    return res.status(403).json(`Not enough clearance`)

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

                const isInProject = await connection('projects')
                .join('members', { 'projects.id': 'members.project_id' })
                .join('users', { 'users.id': 'members.user_id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('projects.id', projectId) // project exist
                .where('users.id', loggedUserId)
                .select('users.id')
                .first()

                if(!isInProject)
                    return res.status(403).json(`Not enough clearance`)


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
    }
}