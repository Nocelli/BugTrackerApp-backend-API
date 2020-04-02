const connection = require('../database/connection')

module.exports = {
    async listRoles(req, res) {
        const roles = await connection('roles')
            .select('*')
        return res.json(roles)
    },

    async createRole(req, res) {
        /* return res.status(501).send() */

        const { name, description, read, edit, create } = req.body
        const id = await connection('roles').insert({
            name,
            description,
            read,
            edit,
            create
        })

        return res.status(201).json({ 'id': id })
    }
}