const connection = require('../database/connection')
const IsTheUserInTheProject = require('../utils/IsTheUserInTheProject')
const VerifyToken = require('../utils/VerifyToken')
const GetUserMemberIdInProject = require('../utils/GetUserMemberIdInProject')
const GetProjectIdByTicketId = require('../utils/GetProjectIdByTicketId')
const knex = require('knex')

module.exports = {
    async listProjectTickets(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {

                const userId = token.DecodedToken.userId
                const projectId = req.params.projectId
                const status = req.params.status

                //check if user is in the project
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json('You cant see tickets from this project')

                const tickets = (status ?
                    await connection('tickets')
                        .join('members', { 'tickets.member_id': 'members.id' })
                        .join('users', { 'members.user_id': 'users.id' })
                        .where('tickets.project_id', projectId)
                        .where('tickets.status', status.toLowerCase())
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
                        .where('tickets.project_id', projectId)
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
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async createTicket(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {

                const userId = token.DecodedToken.userId
                const { name, description, summary, status, severity, type } = req.body
                const projectId = req.params.projectId

                //check if user is in the project
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json('You cant create a ticket in this project')

                const memberId = await GetUserMemberIdInProject(projectId, userId)

                await connection('tickets').insert({
                    name,
                    description,
                    summary,
                    status: status.toLowerCase(),
                    severity: severity.toLowerCase(),
                    type: type.toLowerCase(),
                    date: Math.floor(new Date().getTime()/1000.0),
                    project_id: projectId,
                    member_id: memberId
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

    async deleteTicket(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {

                const userId = token.DecodedToken.userId
                const ticketId = req.params.ticketId
                const projectId = await GetProjectIdByTicketId(ticketId)

                //check if user is in the project
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json('You cant delete a ticket in this project')


                await connection('tickets')
                    .where('id', ticketId)
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
    },

    async changeTicketStatus(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {

                const userId = token.DecodedToken.userId
                const ticketId = req.params.ticketId
                const { status } = req.body
                const projectId = await GetProjectIdByTicketId(ticketId)

                //check if user is in the project
                if (!(await IsTheUserInTheProject(projectId, userId)))
                    return res.status(401).json('You cant change a ticket in this project')


                await connection('tickets')
                    .where('id', ticketId)
                    .update({
                        status: status.toLowerCase()
                    })

                return res.status(202).send()
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