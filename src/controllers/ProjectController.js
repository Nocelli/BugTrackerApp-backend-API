const connection = require('../database/connection')
const generateUniqueId = require('../utils/GenerateUniqueId')
const getRoleId = require('../utils/GetRoleIdByName')
const knex = require('knex')


module.exports = {
    async createProject(req, res) {
        try {
                const { name, summary, description } = req.body
                const roleId = await getRoleId('Dono')
                const ownerId = res.locals.userId
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
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    //this function will be removed
    async listProjects(req, res) {
        try {
            const projects = await connection('projects')
                .join('members', { 'project_id': 'projects.id' })
                .join('users', { 'users.id': 'members.user_id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('roles.id', '1')
                .select(
                    'projects.*',
                    knex.raw(`users.name as "Dono"`),
                    knex.raw(`users.id as "Dono-ID"`)
                )

            return res.json(projects)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async listMyProjects(req, res) {
        try {
            const ownerId = res.locals.userId

            const projects = await connection('projects')
                .join('members', { 'project_id': 'projects.id' })
                .join('users', { 'users.id': 'members.user_id' })
                .join('roles', { 'roles.id': 'members.role_id' })
                .where('roles.id', '1')
                .where('users.id', ownerId)
                .select('projects.*')

            return res.json(projects)

        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },

    async deleteProject(req, res) {
        try {
                const projectId = req.params.projectId
                const loggedUserId = res.locals.userId

                const project = await connection('projects')
                    .join('members', { 'project_id': 'projects.id' })
                    .join('users', { 'users.id': 'members.user_id' })
                    .join('roles', { 'roles.id': 'members.role_id' })
                    .where('roles.id', '1')
                    .where('users.id', loggedUserId)
                    .where('projects.id', projectId)
                    .select('projects.id')
                    .first()

                if (!project)
                    return res.status(404).json(`Project not found`)


                //delete all members
                await connection('members').where('members.project_id', project.id).delete()
                //delete all tickets
                await connection('tickets').where('tickets.project_id', project.id).delete()
                //delete project
                await connection('projects').where('projects.id', project.id).delete()

                return res.status(204).send()
            }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }
}