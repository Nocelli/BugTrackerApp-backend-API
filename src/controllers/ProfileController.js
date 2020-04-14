const connection = require('../database/connection')
const IsTheUserInTheProject = require('../utils/IsTheUserInTheProject')
const knex = require('knex')({ client: 'pg' });
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
            return res.status(500).json({ error: err })
        }
    },

    async ListMyTickets(req, res) {
        try {

            const userId = res.locals.userId
            const projectId = req.params.projectId

            //check if user is in the project
            if (projectId)
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json({ error: 'You cant see tickets from this project' })


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
            return res.status(500).json({ error: err })
        }
    },

    async ListProjectInfo(req, res) {
        try {
            const userId = res.locals.userId
            const projectId = req.params.projectId

            //check if user is in the project
            if (projectId)
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json({ error: 'You cant see this project' })


            const project = await connection('projects')
                .where('projects.id', projectId)
                .select(
                    knex.raw(`projects.name as "project_name"`),
                    knex.raw(`projects.summary as "project_summary"`),
                    knex.raw(`projects.description as "project_description"`))
                    .first()

            const tickets = await connection('tickets')
                .join('projects', { 'tickets.project_id': 'projects.id' })
                .join('members', { 'projects.id': 'members.project_id' })
                .join('users', { 'members.user_id': 'users.id' })
                .where('projects.id', projectId)
                .select(
                	knex.raw(`tickets.id as "ticket_id"`),
                    knex.raw(`tickets.name as "ticket_name"`),
                    knex.raw(`tickets.summary as "ticket_summary"`),
                    knex.raw(`tickets.description as "ticket_description"`),
                    knex.raw(`tickets.status as "ticket_status"`),
                    knex.raw(`tickets.severity as "ticket_severity"`),
                    knex.raw(`tickets.type as "ticket_type"`),
                    knex.raw(`tickets.date as "ticket_creationdate"`),
                    knex.raw(`users.name as "madeby"`))

            const members = await connection('members')
                .join('projects', { 'projects.id': 'members.project_id' })
                .join('users', { 'members.user_id': 'users.id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('projects.id', projectId)
                .select(
                    knex.raw(`users.name as "member_name"`),
                    knex.raw(`roles.name as "member_role"`))

            const finalResponse = {
                project,
                tickets,
                members
            }

            return res.json(finalResponse)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ error: err })
        }
    }
}