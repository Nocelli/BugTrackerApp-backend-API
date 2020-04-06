const knex = require('knex')
const configuration = require('../../knexfile')


const config = process.env.NODE_ENV === 'test' ?
    configuration.test : (
        process.env.NODE_ENV === 'development' ?
            configuration.development :
            (process.env.NODE_ENV === 'staging') ?
            configuration.staging :
            configuration.production
    )

const connection = knex(config)
module.exports = connection;