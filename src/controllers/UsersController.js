const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const VerifyToken = require('../utils/VerifyToken')
const GenerateUniqueId = require('../utils/GenerateUniqueId')
const IsEmailAlreadyInUse = require('../utils/IsEmailAlreadyInUse')

module.exports = {
    async createUser(req, res) {
        try {
            const { name, email, password } = req.body
            
            if(await IsEmailAlreadyInUse(email))
                return res.status(400).json('Email Address is Already Registered.')
        
            const hashedPassword = await bcrypt.hash(password, 12)
            const id = GenerateUniqueId()

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
            const token = await VerifyToken(req.headers.token)

            if (token.isValid) {
                const userTokenId = token.DecodedToken.userId


                if (id.length != 8)
                    return res.status(400).json({ error: 'Invalid user id.' })

                const user = await connection('users')
                    .where('id', id)
                    .select('id')
                    .first()

                if (user === undefined)
                    return res.status(404).json({ error: 'User not found.' })

                if (userTokenId === id) {
                    await connection('users').where('id', id).delete()
                    return res.status(204).send()
                }
                else
                    return res.status(401).json({ error: 'Operation not permitted.' })
            }
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
        }
    }
}