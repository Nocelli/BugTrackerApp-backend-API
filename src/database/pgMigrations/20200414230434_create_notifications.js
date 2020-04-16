

exports.up = function(knex) {
    return knex.schema.createTable('notification', function (table) {
        table.increments('id').primary();
        table.bigInteger('date').notNullable();
        table.string('user_id').notNullable();
        table.integer('role_id').unsigned().notNullable();
        table.string('project_id').notNullable();
        table.string('senders_user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
        table.foreign('senders_user_id').references('id').inTable('users');
        table.foreign('role_id').references('id').inTable('roles');
        table.foreign('project_id').references('id').inTable('projects');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('notification');
};