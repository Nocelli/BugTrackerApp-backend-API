const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const GenerateUniqueId = require('../utils/GenerateUniqueId')
const IsEmailAlreadyInUse = require('../utils/IsEmailAlreadyInUse')
const GetUserByEmail = require('../utils/GetUserByEmail')
const sendUserConfirmationEmail = require('../validations/sendUserConfirmationEmail')
const CreateConfirmationToken = require('../validations/CreateConfirmationToken')

module.exports = {
    async createUser(req, res) {
        try {
            const { name, email, password } = req.body

            if (await IsEmailAlreadyInUse(email))
                return res.status(400).json({ error: 'Email Address is Already Registered.' })

            const hashedPassword = await bcrypt.hash(password, 12)
            const id = GenerateUniqueId()

            await connection('users').insert({
                id,
                name,
                email,
                password: hashedPassword,
                confirmed: false
            })

            sendUserConfirmationEmail(email, CreateConfirmationToken(id), 'confirmation')

            return res.status(201).json({ status: 'Waiting for email confirmation' })
        }
        catch (err) {
            console.log({ error: err })
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
            const userTokenId = res.locals.userId


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
        catch (err) {
            console.log({ error: err })
        }
    },

    async newPassword(req, res) {
        try {
            const { email } = req.body
            const user = await GetUserByEmail(email)

            if (!user)
                return res.status(404).json({ error: 'User not found.' })

            if (!user.confirmed) {
                sendUserConfirmationEmail(user.email, CreateConfirmationToken(user.id), 'confirmation')
                return res.status(401).json({ error: 'Confirm your email address, confirmation email sent.' })
            }

            sendUserConfirmationEmail(user.email, CreateConfirmationToken(user.id), 'resetPassword')
            return res.status(200).json({ status: 'Confirmation email sent.' })
        }
        catch (err) {
            console.log({ error: err })
        }
    },

    async changePassword(req, res) {
        try {
            const { password } = req.body
            const userId = res.locals.userId
            const hashedPassword = await bcrypt.hash(password, 12)

            await connection('users')
                .where('users.id', userId)
                .update({ 'password': hashedPassword })

            return res.status(202).json({ status: 'Senha alterada com sucesso!' })
        }
        catch (err) {
            console.log({ error: err })
        }
    }
}