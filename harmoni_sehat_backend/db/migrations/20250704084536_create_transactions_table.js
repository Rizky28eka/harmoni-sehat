/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments('id');
    table.string('order_id').notNullable().unique();
    table.integer('amount').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.string('payment_token');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};