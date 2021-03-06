const MembersController = require('../controllers/MembersController')
const UsersController = require('../controllers/UsersController')
const LoginController = require('../controllers/LoginController')
const RolesController = require('../controllers/RolesController')
const ProjectController = require('../controllers/ProjectController')
const ProfileController = require('../controllers/ProfileController')
const TicketController = require('../controllers/TicketsController')
const ConfirmationsController = require('../controllers/ConfirmationsController')
const NotificationController = require('../controllers/NotificationController')


module.exports = {
    Notifications: NotificationController,
    Confirmations: ConfirmationsController,
    Members: MembersController,
    Users: UsersController,
    Login: LoginController,
    Roles: RolesController,
    Projects: ProjectController,
    Profile: ProfileController,
    Tickets: TicketController
}
