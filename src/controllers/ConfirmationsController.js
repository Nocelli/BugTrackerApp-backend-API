const connection = require('../database/connection')
const GetUserById = require('../utils/GetUserById')
const GetUserByEmail = require('../utils/GetUserByEmail')
const sendUserConfirmationEmail = require('../validations/sendUserConfirmationEmail')
const CreateConfirmationToken = require('../validations/CreateConfirmationToken')
const jwt = require('jsonwebtoken')

module.exports = {
    async validateEmail(req, res) {
        try {
            const confirmationToken = req.params.confirmationToken

            jwt.verify(confirmationToken, process.env.TOKEN_KEY, async (err, decoded) => {
                if (err)
                    return res.status(401).json({ error: 'Confirmation token not valid' })

                const user = await GetUserById(decoded.userId)

                if (!user)
                    return res.status(401).json({ error: 'Confirmation token not valid' })

                await connection('users')
                    .where('users.id', user.id)
                    .update({ confirmed: true })
            })

            return res.status(200).send()
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ error: err })
        }
    },

    async resendEmail(req, res){
        try {
                const { userEmail } = req.body
                const user = await GetUserByEmail(userEmail)

                if (!user)
                    return res.status(401).json({ error: 'Invalid e-mail' })

                if(user.confirmed)
                    return res.status(401).json({ error: 'This email was already confirmed' })
                
                
            sendUserConfirmationEmail(user.email,CreateConfirmationToken(user.id),'confirmation')

            return res.status(201).json({status : 'Waiting for email confirmation'})
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ error: err })
        }
    }
}
