const connection = require('../database/connection')


//this function return the project`s id were the ticket was created
module.exports = async function GetProjectIdByTicketId(ticketId) {
    try {
        const projectId = await connection('projects')
            .join('tickets', { 'projects.id': 'tickets.project_id' })
            .where('tickets.id', ticketId)
            .select('projects.id')
            .first()

        if (projectId)
            return projectId.id
        else
            return false
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}