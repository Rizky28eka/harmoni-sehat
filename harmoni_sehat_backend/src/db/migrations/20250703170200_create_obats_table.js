/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('obats', function (table) {
    table.increments('id').primary();
    table.string('nama').notNullable();
    table.text('deskripsi');
    table.string('kategori');
    table.boolean('perlu_resep').notNullable().defaultTo(true);
    table.integer('stok_total').defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('obats');
};