// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/database.sqlite'
    },
    migrations : {
      directory : './src/database/migrations'
    },
    seeds: {
      directory : './src/database/seeds'
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/test_database.sqlite'
    },
    migrations : {
      directory : './src/database/migrations'
    },
    seeds: {
      directory : './src/database/seeds'
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    migrations : {
      directory : './src/database/migrations'
    },
    seeds: {
      directory : './src/database/seeds'
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations : {
      directory : './src/database/migrations'
    },
    seeds: {
      directory : './src/database/seeds'
    },
  }

};
