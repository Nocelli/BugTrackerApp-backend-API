const connection = require('../database/connection')
const VerifyToken = require('../utils/VerifyToken')
const IsTheUserInTheProject = require('../utils/IsTheUserInTheProject')
const knex = require('knex')

module.exports = {

    async ListProjectsImIn(req, res) {
        try {
            const loggedUserId = res.locals.userId

            const myProjects = await connection('projects')
                .join('members', { 'projects.id': 'members.project_id' })
                .join('users', { 'users.id': 'members.user_id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('users.id', loggedUserId)
                .select('projects.*',
                    knex.raw(`roles.name as "Role"`))

            return res.json(myProjects)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async ListMyTickets(req, res) {
        try {

            const userId = res.locals.userId
            const projectId = req.params.projectId

            //check if user is in the project
            if (projectId)
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json('You cant see tickets from this project')


            const tickets = (projectId ?
                await connection('tickets')
                    .join('members', { 'tickets.member_id': 'members.id' })
                    .join('users', { 'members.user_id': 'users.id' })
                    .where('tickets.project_id', projectId)
                    .where('users.id', userId)
                    .select(
                        'tickets.id',
                        'tickets.name',
                        'tickets.description',
                        'tickets.summary',
                        'tickets.status',
                        'tickets.severity',
                        'tickets.type',
                        'tickets.date',
                        knex.raw(`users.name as "MadeBy"`))
                :
                await connection('tickets')
                    .join('members', { 'tickets.member_id': 'members.id' })
                    .join('users', { 'members.user_id': 'users.id' })
                    .where('users.id', userId)
                    .select(
                        'tickets.id',
                        'tickets.name',
                        'tickets.description',
                        'tickets.summary',
                        'tickets.status',
                        'tickets.severity',
                        'tickets.type',
                        'tickets.date',
                        knex.raw(`users.name as "MadeBy"`))
            )

            return res.status(200).json(tickets)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }
}