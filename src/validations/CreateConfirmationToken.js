const jwt = require('jsonwebtoken');

module.exports = function CreateConfirmationToken(userId) {
    try {
        return jwt.sign(
            {userId: userId},
            process.env.TOKEN_KEY,
            {expiresIn: `1d`})
    } 
    catch (err) {
        console.log(err)
    }

}