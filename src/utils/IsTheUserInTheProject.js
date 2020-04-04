const connection = require('../database/connection')

//this function return the user role if the user is in the project, and return undefined if not
module.exports = async function isTheUserInTheProject(projectId, userId) {
    try {
        const roleId = await connection('projects')
            .join('members', { 'projects.id': 'members.project_id' })
            .join('users', { 'users.id': 'members.user_id' })
            .join('roles', { 'roles.id': 'members.role_id' })
            .where('projects.id', projectId) // project exist
            .where('users.id', userId)
            .select('roles.id')
            .first()

        if (roleId != undefined)
            return roleId.id
        
        return false
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}