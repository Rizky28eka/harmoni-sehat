/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('reseps', function (table) {
    table.increments('id').primary();
    table
      .integer('konsultasi_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('konsultasi')
      .onDelete('CASCADE');
    table
      .integer('apoteker_id')
      .unsigned()
      .references('id')
      .inTable('apotekers')
      .onDelete('SET NULL'); // Jika apoteker dihapus, resep tidak ikut terhapus
    table
      .enu('status', ['diterbitkan', 'diproses', 'selesai', 'ditolak'])
      .notNullable()
      .defaultTo('diterbitkan');
    table.text('catatan');
    table.timestamp('diterbitkan_pada').defaultTo(knex.fn.now());
    table.timestamp('selesai_pada');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('reseps');
};