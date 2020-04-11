const express = require('express')
const Controllers = require('./controllers')
const Validate = require('./validations/Validate')
const Authenticate = require('./authentication/Authenticate')

const routers = express.Router()


routers.get('/confirmations/validation/:confirmationToken', Validate.confirmationToken ,Controllers.Confirmations.validateEmail)
routers.post('/confirmations/resendemail', Controllers.Confirmations.resendEmail)

routers.get('/tickets/:projectId/:status?', Authenticate, Validate.ListProjectTickets, Controllers.Tickets.listProjectTickets)
routers.post('/tickets/:projectId', Authenticate, Validate.CreateTickets, Controllers.Tickets.createTicket)
routers.delete('/tickets/:ticketId', Authenticate, Validate.DeleteTicket, Controllers.Tickets.deleteTicket)
routers.put('/tickets/:ticketId', Authenticate, Validate.ChangeTicketStatus, Controllers.Tickets.changeTicketStatus)

//routers.get('/users', Controllers.Users.listUsers)
routers.post('/users', Validate.CreateUser, Controllers.Users.createUser)
routers.delete('/users/:id', Authenticate, Validate.DeleteUser, Controllers.Users.deleteUser)
routers.post('/password/new', Validate.NewPassword, Controllers.Users.newPassword)
routers.put('/password/new', Authenticate, Validate.ChangePassword, Controllers.Users.changePassword)

routers.post('/login', Validate.Login, Controllers.Login.loginUser)

routers.get('/roles', Controllers.Roles.listRoles)
//routers.post('/roles', Controllers.Roles.createRole)

routers.get('/project', Authenticate, Controllers.Projects.listMyProjects)
routers.post('/project', Authenticate, Validate.CreateProject, Controllers.Projects.createProject)
routers.delete('/project/:projectId', Authenticate, Validate.DeleteProject, Controllers.Projects.deleteProject)

routers.get('/profile', Authenticate, Controllers.Profile.ListProjectsImIn)
routers.get('/profile/tickets/:projectId?', Authenticate, Validate.ListMyTickets, Controllers.Profile.ListMyTickets)

routers.post('/member/:projectId', Authenticate, Validate.AddMemberToProject, Controllers.Members.addMemberToProject)
routers.get('/member/:projectId', Authenticate, Validate.ListMembersOfProject, Controllers.Members.listMemberOfProject)
routers.delete('/member/:projectId', Authenticate, Validate.KickMember, Controllers.Members.kickMember)
routers.put('/member/:projectId', Authenticate, Validate.ChangeRole, Controllers.Members.changeRole)



module.exports = routers