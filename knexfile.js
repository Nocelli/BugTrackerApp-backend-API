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
    client: 'pg',
    connection: {
      database: 'bugtrackerDB',
      user: 'postgres',
      password: '1234'
    },
    migrations : {
      directory : './src/database/pgMigrations'
    },
    seeds: {
      directory : './src/database/seeds'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations : {
      directory : './src/database/pgMigrations'
    },
    seeds: {
      directory : './src/database/seeds'
    },
    useNullAsDefault: true,
  }

};
