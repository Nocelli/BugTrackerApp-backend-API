const express = require('express')
const TicketController = require('./controllers/TicketsController')
const UsersController = require('./controllers/UsersController')
const LoginController = require('./controllers/LoginController')
const RolesController = require('./controllers/RolesController')
const ProjectController = require('./controllers/ProjectController')

const routers = express.Router()

routers.get('/', (req, res)=>{
    res.json({
        Foo: 'bar'
    })

    return res.json
})

routers.get('/users', UsersController.listUsers)
routers.post('/users', UsersController.createUser)
routers.delete('/users/:id', UsersController.deleteUser)

routers.post('/login', LoginController.loginUser)

routers.get('/roles', RolesController.listRoles)
routers.post('/roles', RolesController.createRole)

routers.post('/project', ProjectController.createProject)

module.exports = routers