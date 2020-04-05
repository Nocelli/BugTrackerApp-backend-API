const express = require('express')
const MembersController = require('./controllers/MembersController')
const UsersController = require('./controllers/UsersController')
const LoginController = require('./controllers/LoginController')
const RolesController = require('./controllers/RolesController')
const ProjectController = require('./controllers/ProjectController')
const ProfileController = require('./controllers/ProfileController')
const TicketController = require('./controllers/TicketsController')

const routers = express.Router()

routers.get('/tickets/:projectId/:status', TicketController.listProjectTickets)
routers.post('/tickets/:projectId', TicketController.createTicket)
routers.delete('/tickets/:ticketsId', TicketController.deleteTicket)

routers.get('/users', UsersController.listUsers)
routers.post('/users', UsersController.createUser)
routers.delete('/users/:id', UsersController.deleteUser)

routers.post('/login', LoginController.loginUser)

routers.get('/roles', RolesController.listRoles)
routers.post('/roles', RolesController.createRole)

routers.get('/project', ProjectController.listMyProjects)
routers.post('/project', ProjectController.createProject)
routers.delete('/project/:projectId', ProjectController.deleteProject)

routers.get('/profile', ProfileController.ListProjectsImIn)

routers.post('/member/:projectId', MembersController.addMemberToProject)
routers.get('/member/:projectId', MembersController.listMemberOfProject)
routers.delete('/member/:projectId', MembersController.kickMember)
routers.put('/member/:projectId', MembersController.changeRole)



module.exports = routers