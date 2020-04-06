const MembersController = require('../controllers/MembersController')
const UsersController = require('../controllers/UsersController')
const LoginController = require('../controllers/LoginController')
const RolesController = require('../controllers/RolesController')
const ProjectController = require('../controllers/ProjectController')
const ProfileController = require('../controllers/ProfileController')
const TicketController = require('../controllers/TicketsController')


module.exports = {
    Members: MembersController,
    Users: UsersController,
    Login: LoginController,
    Roles: RolesController,
    Projects: ProjectController,
    Profile: ProfileController,
    Tickets: TicketController
}
