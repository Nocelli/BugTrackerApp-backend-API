const express = require('express')


const routers = express.Router()

routers.get('/', (req, res)=>{
    res.json({
        Foo: 'bar'
    })

    return res.json
})


module.exports = routers