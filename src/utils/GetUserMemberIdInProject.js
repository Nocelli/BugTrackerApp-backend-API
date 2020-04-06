const connection = require('../database/connection')


//this function return the user`s member id in the specified project
module.exports = async function GetUserMemberIdInProject(projectId, userId) {
    try {
        const memberId = await connection('projects')
            .join('members', { 'projects.id': 'members.project_id' })
            .join('users', { 'users.id': 'members.user_id' })
            .where('projects.id', projectId) // project exist
            .where('users.id', userId)
            .select('members.id')
            .first()

        if (memberId)
            return memberId.id
        else
            return false
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}