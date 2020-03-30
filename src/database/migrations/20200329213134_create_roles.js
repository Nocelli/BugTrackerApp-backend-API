
exports.up = function(knex) {
    return knex.schema.createTable('roles', function (table) {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.boolean('read').notNullable()
        table.boolean('edit').notNullable()
        table.boolean('create').notNullable()
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('roles');
};
