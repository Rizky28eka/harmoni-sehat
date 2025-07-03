// db/migrations/YYYYMMDDHHMMSS_create_data_kesehatan_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('data_kesehatan', function (table) {
    table.increments('id').primary();
    table.string('nama', 255).notNullable();
    table.integer('detakJantung').notNullable();
    table.decimal('suhuTubuh', 5, 2).notNullable();
    table.timestamp('tanggal').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('data_kesehatan');
};