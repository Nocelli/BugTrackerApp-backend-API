const { CountNotifications } = require('./controllers/NotificationController');

let io;
let users = {}

module.exports = {
    listen: function(app) {
        io = require('socket.io').listen(app);

        io.use((socket, next) => {
            var handshakeData = socket.request
            socket.userId = handshakeData._query['userId']
            next()
          })

        io.on('connection', async socket => {
            users[socket.userId] = socket.id
            const { count }  = await CountNotifications(socket.userId)
            io.to(socket.id).emit('FromAPI', count)

            socket.on('disconnect', function () {
                delete users[socket.userId]
              })
        })

        return io;
    },
    getio: function() {
        return {io,users};
    }
}