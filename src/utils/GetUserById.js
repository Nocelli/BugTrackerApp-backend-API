const connection = require('../database/connection')


//this function return the user or undefined if none is found
module.exports = async function GetUserById(id) {
    try {
        return (await connection('users')
            .where('id', id)
            .select('*')
            .first())
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}