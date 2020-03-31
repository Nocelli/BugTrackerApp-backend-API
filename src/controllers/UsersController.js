const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateUniqueId = require('../utils/GenerateUniqueId')

module.exports = {
    async createUser(req, res) {
        try {
            const { name, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 12)
            const id = generateUniqueId()

            await connection('users').insert({
                id,
                name,
                email,
                password: hashedPassword
            })

            return res.status(201).json({ id })
        }
        catch (err) {
            console.log(err)
        }
    },

    //This function will be removed soon
    async listUsers(req, res) {
        const users = await connection('users').select('*')
        return res.json(users)
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const userToken = req.headers.token

            if (id.length != 8)
                return res.status(400).json({ error: 'Invalid user id.' })

            const user = await connection('users')
                .where('id', id)
                .select('id')
                .first()

            if (user === undefined) {
                return res.status(404).json({ error: 'User not found.' })
            }

            jwt.verify(userToken, process.env.TOKEN_KEY, async (err, decoded) => {
                if (err)
                    return res.status(401).json({ error: 'Invalid token.' })
                if (decoded) {
                    if (decoded.userId == id) {
                        await connection('users').where('id', decoded.userId).delete()
                        return res.status(204).send()
                    }
                    else
                        return res.status(401).json({ error: 'Operation not permitted.' })
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }
}