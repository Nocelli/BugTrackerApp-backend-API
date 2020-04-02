const app = require('./app')
const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})


app.listen(process.env.PORT, err => {
    if(err)
        console.log(`Error: ${err}`)
})


console.log(`Server running in ${process.env.NODE_ENV} at PORT: ${process.env.PORT}`)