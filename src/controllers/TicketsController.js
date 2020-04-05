const connection = require('../database/connection')

module.exports = {
    async listProjectTickets(req, res) {
        return res.status(501).send()
    },

    async createTicket(req, res) {
        return res.status(501).send()
    },

    async deleteTicket(req, res) {
        return res.status(501).send()
    }
}