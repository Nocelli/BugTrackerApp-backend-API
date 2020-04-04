//this function return the user`s member id in the specified project

const connection = require('../database/connection')

//this function return the user role if the user is in the project, and return undefined if not
module.exports = async function GetUserMemberIdInProject(projectId, userId) {
    try {
        const memberId = await connection('projects')
            .join('members', { 'projects.id': 'members.project_id' })
            .join('users', { 'users.id': 'members.user_id' })
            .where('projects.id', projectId) // project exist
            .where('users.id', userId)
            .select('members.id')
            .first()

        if (memberId != undefined)
            return memberId
        else
            return false
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}