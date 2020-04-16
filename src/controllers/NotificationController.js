const connection = require('../database/connection')
const knex = require('knex')({ client: 'pg' });

module.exports = {
    async CountNotifications(userId) {
        try {
            if (!userId)
                return 0

            const totalNotifications = await connection('notification')
                .where('user_id', userId)
                .count()
                .first()

            return totalNotifications
        }
        catch (err) {
            console.log(err)
            return 0
        }
    },

    async ListUserNotifications(req, res) {
        try {
            const userId = res.locals.userId

            const notifications = await connection('notification')
                .join('projects', { 'notification.project_id': 'projects.id' })
                .join('users', { 'notification.senders_user_id' : 'users.id' })
                .join('roles', {'notification.role_id' : 'roles.id'})
                .where('notification.user_id', userId)
                .select(
                	knex.raw(`notification.id as "notification_id"`),
                    knex.raw(`users.name as "senders_name"`),
                    knex.raw(`projects.name as "project_name"`),
                    knex.raw(`roles.name as "role_name"`),
                    knex.raw(`notification.date as "notification_creationdate"`))

            return res.json(notifications)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }
}