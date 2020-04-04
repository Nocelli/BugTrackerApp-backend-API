const connection = require('../database/connection')
const VerifyToken = require('../utils/VerifyToken')
const knex = require('knex')

module.exports = {

    async ListProjectsImIn(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {
                const loggedUserId = token.DecodedToken.userId

                const myProjects = await connection('projects')
                .join('members', { 'projects.id': 'members.project_id' })
                .join('users', { 'users.id': 'members.user_id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('users.id', loggedUserId)
                .select('projects.*',
                knex.raw(`roles.name as "Role"`),)

                return res.json(myProjects)
            }
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
}