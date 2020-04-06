
exports.up = function(knex) {
    return knex.schema.createTable('tickets', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('summary').notNullable();
        table.string('status').notNullable();
        table.string('severity').notNullable();
        table.string('type').notNullable();
        table.bigInteger('date').notNullable();
        table.string('project_id').notNullable();
        table.integer('member_id').unsigned().notNullable();

        table.foreign('project_id').references('id').inTable('projects');
        table.foreign('member_id').references('id').inTable('members');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tickets');
};