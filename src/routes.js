const express = require('express')
const TicketController = require('./controllers/TicketController')
const UsersController = require('./controllers/UsersController')
const LoginController = require('./controllers/LoginController')

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


module.exports = routers