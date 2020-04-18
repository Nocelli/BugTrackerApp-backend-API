const jwt = require('jsonwebtoken')
const GetUserById = require('../utils/GetUserById')


const AuthenticateTokens = (req, res, next) => {
    try {
        const token = req.headers['x-token'] || req.body.token
        const refreshToken = req.headers['x-token-refresh']

        if(!token)
            return res.status(401).json({ error: 'Token must be provided' })
        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
                if (err.name.localeCompare('TokenExpiredError'))
                    return res.status(401).json({ error: 'Failed to authenticate code:01' })

                jwt.verify(token, process.env.TOKEN_KEY, { ignoreExpiration: true }, async (err, decoded) => {
                    const user = await GetUserById(decoded.userId)
                    if (!user)
                        return res.status(404).json({ error: 'User not found' })

                    jwt.verify(refreshToken, user.password, (err, decoded) => {
                        if (err)
                            return res.status(401).json({ error: 'Failed to authenticate code:02' })

                        res.locals.userId = user.id
                        res.setHeader('x-token', jwt.sign(
                            { userId: decoded.userId },
                            process.env.TOKEN_KEY,
                            { expiresIn: `${process.env.EXPIRATIONTIME}m` }))

                        next()
                    })
                })
            }
            if (decoded) {
                res.locals.userId = decoded.userId
                next()
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


module.exports = AuthenticateTokens
