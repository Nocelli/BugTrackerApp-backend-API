const connection = require('../database/connection')
const VerifyToken = require('../utils/VerifyToken')
const generateUniqueId = require('../utils/GenerateUniqueId')
const getRoleId = require('../utils/GetRoleIdByName')


module.exports = {
    async createProject(req, res) {
        try {
            const token = await VerifyToken(req.headers.token)
            if (token.isValid) {

                const { name, summary, description } = req.body
                const roleId = await getRoleId('Dono')
                const ownerId = token.DecodedToken.userId
                const id = generateUniqueId()

                //Creating project
                await connection('projects').insert({
                    id,
                    name,
                    summary,
                    description
                })

                //Adding Owner as member to the project
                await connection('members').insert({
                    user_id: ownerId,  // <-- user ID
                    role_id: roleId,   // <-- role ID
                    project_id: id     // <-- project ID
                })

                return res.status(201).json({ ProjectId: id })
            }
            else
                return res.status(401).json(token.error)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    //this function will be removed
    async listProjects(){

    }
}