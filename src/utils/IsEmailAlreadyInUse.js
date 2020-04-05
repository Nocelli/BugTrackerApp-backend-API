const connection = require('../database/connection')

//function returns true if an user with that email is already registred in the db, and false if not
const IsEmailAlreadyInUse = async (email) => {
    
    return Boolean(await connection('users')
    .select('id')
    .where('email', email)
    .first())
}

module.exports = IsEmailAlreadyInUse