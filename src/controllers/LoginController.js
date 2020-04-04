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
                .first()

            if(user === undefined)
                return res.status(401).json({ error: 'Operation not permitted.' })

            await bcrypt.compare(password, user.password,
                (err, result) => {
                    if(err)
                        return res.status(401).json({ error: 'Operation not permitted.' })

                    if (result) {
                        const token = jwt.sign(
                            {
                                userId: user.id
                            },
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: `${process.env.EXPIRATIONTIME}m`
                            })
                        return res.status(200).json({ token: token })
                    }
                    else
                        return res.status(401).json({ error: 'Operation not permitted.' })
                })
        }
        catch (err) {
            console.log(err)
        }
    }
}