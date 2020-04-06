
exports.up = function(knex) {
    return knex.schema.createTable('members', function (table) {
        table.increments('id').primary();
        table.string('user_id').notNullable();
        table.string('role_id').notNullable();
        table.string('project_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
        table.foreign('role_id').references('id').inTable('roles');
        table.foreign('project_id').references('id').inTable('projects');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('members');
};