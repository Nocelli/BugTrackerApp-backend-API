const { celebrate, Segments, Joi } = require('celebrate')

module.exports = {
    ListProjectTickets: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().required(),
            status: Joi.string()
        })
    }),

    CreateTickets: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            description: Joi.string().required().max(255),
            summary: Joi.string().required().max(144),
            status: Joi.string().required().valid("Aberto","Em andamento","Para ser testado","Fechado"),
            severity: Joi.string().required().valid("Nenhum", "Crítico", "Grave", "Não-urgente"),
            type: Joi.string().required().valid("Subtarefa", "Bug", "Aperfeiçoamento", "Novo recurso", "Tarefa")
        }),
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().required()
        })
    }),

    DeleteTicket: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            ticketId: Joi.string().required()
        })
    }),

    confirmationToken : celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            confirmationToken: Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        })
    }),

    ChangeTicketStatus: celebrate({
        [Segments.BODY]: Joi.object().keys({
            status: Joi.string().required().max(20)
        }),
        [Segments.PARAMS]: Joi.object().keys({
            ticketId: Joi.string().required()
        })
    }),

    CreateUser: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8).max(16)
        })
    }),

    DeleteUser: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.string().length(8).required()
        })
    }),

    NewPassword: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required().email()
        })
    }),

    ChangePassword: celebrate({
        [Segments.BODY]: Joi.object().keys({
            password: Joi.string().required().min(8).max(16),
            token: Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        })
    }),

    Login: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8).max(16)
        })
    }),

    CreateProject: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().max(50),
            summary: Joi.string().required().max(144),
            description: Joi.string().required().max(255)
        })
    }),

    DeleteProject: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8).required()
        })
    }),

    ListMyTickets: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8)
        })
    }),

    ListProjectInfo : celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8).required()
        })
    }),

    SendNotification: celebrate({
        [Segments.BODY]: Joi.object().keys({
            userEmail: Joi.string().required().email(),
            roleId: Joi.number().required()
        }),
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8).required()
        })
    }),

    AddMemberToProject: celebrate({
        [Segments.BODY]: Joi.object().keys({
            notificationId: Joi.required()
        })
    }),

    ListMembersOfProject: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8).required()
        })
    }),

    KickMember: celebrate({
        [Segments.BODY]: Joi.object().keys({
            userId: Joi.string().required().length(8)
        }),
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8).required()
        })
    }),

    ChangeRole: celebrate({
        [Segments.BODY]: Joi.object().keys({
            userId: Joi.string().required().length(8),
            newRoleId: Joi.number().required()
        }),
        [Segments.PARAMS]: Joi.object().keys({
            projectId: Joi.string().length(8).required()
        })
    }),
}