const connection = require('../database/connection')

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
    }
}