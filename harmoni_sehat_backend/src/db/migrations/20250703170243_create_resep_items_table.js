/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('resep_items', function (table) {
    table.increments('id').primary();
    table
      .integer('resep_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('reseps')
      .onDelete('CASCADE');
    table
      .integer('obat_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('obats')
      .onDelete('CASCADE');
    table.string('dosis').notNullable();
    table.integer('kuantitas').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('resep_items');
};