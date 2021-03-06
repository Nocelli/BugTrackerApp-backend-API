const app = require('./app')
const dotenv = require('dotenv')
const http = require('http').createServer(app);
const io = require('./socket').listen(http)


dotenv.config({
    path: './.env'
})

http.listen(process.env.PORT, err => {
    if(err)
        console.log(`Error: ${err}`)
})


console.log(`Server running in ${process.env.NODE_ENV} at PORT: ${process.env.PORT}`)
