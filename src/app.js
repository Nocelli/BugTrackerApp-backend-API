const express = require('express');
const routes = require('./routes.js')
const { errors } = require('celebrate')

const app = express()
app.use(express.json())
app.use(routes)
app.use(errors())


module.exports = app