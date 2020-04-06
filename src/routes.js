const express = require('express')
const Controllers = require('./controllers')
const Validate = require('./validations/Validate')

const routers = express.Router()


routers.get('/tickets/:projectId/:status?', Validate.ListProjectTickets, Controllers.Tickets.listProjectTickets)
routers.post('/tickets/:projectId', Validate.CreateTickets, Controllers.Tickets.createTicket)
routers.delete('/tickets/:ticketId', Validate.DeleteTicket, Controllers.Tickets.deleteTicket)
routers.put('/tickets/:ticketId', Validate.ChangeTicketStatus, Controllers.Tickets.changeTicketStatus)

//routers.get('/users', UsersController.listUsers)
routers.post('/users', Validate.CreateUser, Controllers.Users.createUser)
routers.delete('/users/:id', Validate.DeleteUser, Controllers.Users.deleteUser)

routers.post('/login', Validate.Login, Controllers.Login.loginUser)

routers.get('/roles', Controllers.Roles.listRoles)
//routers.post('/roles', Controllers.Roles.createRole)

routers.get('/project', Validate.ListMyProjects, Controllers.Projects.listMyProjects)
routers.post('/project', Validate.CreateProject, Controllers.Projects.createProject)
routers.delete('/project/:projectId', Validate.DeleteProject, Controllers.Projects.deleteProject)

routers.get('/profile', Validate.ListProjectsImIn, Controllers.Profile.ListProjectsImIn)
routers.get('/profile/tickets/:projectId?', Validate.ListMyTickets, Controllers.Profile.ListMyTickets)

routers.post('/member/:projectId', Validate.AddMemberToProject, Controllers.Members.addMemberToProject)
routers.get('/member/:projectId', Validate.ListMembersOfProject, Controllers.Members.listMemberOfProject)
routers.delete('/member/:projectId', Validate.KickMember, Controllers.Members.kickMember)
routers.put('/member/:projectId', Validate.ChangeRole, Controllers.Members.changeRole)



module.exports = routers