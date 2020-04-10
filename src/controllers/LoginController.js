const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    async loginUser(req, res) {
        try {
            const { email, password } = req.body

            const user = await connection('users')
                .select('*')
                .where('email', email)
                .where('confirmed', true)
                .first()

            if(!user)
                return res.status(404).json({ error: 'User not found.' })

            await bcrypt.compare(password, user.password,
                (err, result) => {
                    if(err)
                        return res.status(401).json({ error: 'Operation not permitted.' })

                    if (result) {
                        const token = jwt.sign(
                            {userId: user.id},
                            process.env.TOKEN_KEY,
                            {expiresIn: `${process.env.EXPIRATIONTIME}m`})

                        const refreshToken = jwt.sign(
                            {userId: user.id},
                            user.password,
                            {expiresIn: `${process.env.EXPIRATIONTIMEREFRESH}d`})

                        res.setHeader('x-token', token)
                        res.setHeader('x-token-refresh', refreshToken)
                        return res.status(200).send()
                    }
                    else
                        return res.status(401).json({ error: 'Operation not permitted.' })
                })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ error: err })
        }
    }
}