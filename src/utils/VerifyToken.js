const jwt = require('jsonwebtoken')

module.exports = async function VerifyToken(token) {
    return await jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err)
            return { isValid: false, error: err.message } 
            
        return { isValid: true, DecodedToken: decoded }
    })

}