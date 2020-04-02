const connection = require('../database/connection')


const GetRoleIdByName = async (name) => {
    return (
        await connection('roles')
        .select('id')
        .where('name', name)
        .first())
        .id
}

module.exports = GetRoleIdByName