
exports.up = function(knex) {
    return knex.schema.createTable('tickets', function (table) {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('summary').notNullable();
        table.string('status').notNullable();
        table.string('severity').notNullable();
        table.string('type').notNullable();
        table.string('project_id').notNullable();
        table.string('member_id').notNullable();

        table.foreign('project_id').references('id').inTable('projects');
        table.foreign('member_id').references('id').inTable('members');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tickets');
};