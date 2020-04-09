const express = require('express');
const routes = require('./routes.js')
const { errors } = require('celebrate')
const cors = require('cors')

const corsOptions = {
    exposedHeaders: 'x-token, x-token-refresh',
  }

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(routes)
app.use(errors())


module.exports = app