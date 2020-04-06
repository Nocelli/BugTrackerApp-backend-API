const express = require('express')
const { celebrate, Segments, Joi } = require('celebrate')
const MembersController = require('./controllers/MembersController')
const UsersController = require('./controllers/UsersController')
const LoginController = require('./controllers/LoginController')
const RolesController = require('./controllers/RolesController')
const ProjectController = require('./controllers/ProjectController')
const ProfileController = require('./controllers/ProfileController')
const TicketController = require('./controllers/TicketsController')

const routers = express.Router()


//tickets
routers.get('/tickets/:projectId/:status?',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().required(),
        status: Joi.string()
    })
}), TicketController.listProjectTickets)

routers.post('/tickets/:projectId',celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        summary: Joi.string().required().max(200),
        status: Joi.string().required().max(20),
	    severity: Joi.string().required().max(20),
	    type: Joi.string().required().max(20)
    }),
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().required()
    })
}), TicketController.createTicket)

routers.delete('/tickets/:ticketId',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        ticketId: Joi.string().required()
    })
}), TicketController.deleteTicket)

routers.put('/tickets/:ticketId',celebrate({
    [Segments.BODY]: Joi.object().keys({
        status: Joi.string().required().max(20)
    }),
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        ticketId: Joi.string().required()
    })
}), TicketController.changeTicketStatus)


//users
routers.get('/users', UsersController.listUsers)
routers.post('/users',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8).max(16)
        })
    }), UsersController.createUser)
routers.delete('/users/:id',celebrate({
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown(),
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.string().length(8).required()
        })
    }), UsersController.deleteUser)


//login and sessions
routers.post('/login',celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8).max(16)
    })
}), LoginController.loginUser)


//roles
routers.get('/roles', RolesController.listRoles)
routers.post('/roles', RolesController.createRole)


//project
routers.get('/project',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown()
}), ProjectController.listMyProjects)

routers.post('/project', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required().max(50),
        summary: Joi.string().required().max(144),
        description: Joi.string().required().max(500)
    }),
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown()
}),ProjectController.createProject)
routers.delete('/project/:projectId',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().length(8).required()
    })
}), ProjectController.deleteProject)


//profile
routers.get('/profile',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown()
 }), ProfileController.ListProjectsImIn)

routers.get('/profile/tickets/:projectId?',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().length(8)
    })
 }), ProfileController.ListMyTickets)


//members
routers.post('/member/:projectId',celebrate({
    [Segments.BODY]: Joi.object().keys({
        userId: Joi.string().required().length(8),
        roleId: Joi.number().required()
    }),
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().length(8).required()
    })
 }), MembersController.addMemberToProject)

routers.get('/member/:projectId',celebrate({
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().length(8).required()
    })
 }), MembersController.listMemberOfProject)

routers.delete('/member/:projectId',celebrate({
    [Segments.BODY]: Joi.object().keys({
        userId: Joi.string().required().length(8)
    }),
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().length(8).required()
    })
 }), MembersController.kickMember)

routers.put('/member/:projectId',celebrate({
    [Segments.BODY]: Joi.object().keys({
        userId: Joi.string().required().length(8),
        newRoleId: Joi.number().required()
    }),
    [Segments.HEADERS]: Joi.object({
        token: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        projectId: Joi.string().length(8).required()
    })
 }), MembersController.changeRole)



module.exports = routers