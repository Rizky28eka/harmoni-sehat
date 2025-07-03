/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('konsultasi', function (table) {
    table.increments('id').primary();
    table
      .integer('pasien_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('pasiens')
      .onDelete('CASCADE');
    table
      .integer('dokter_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('dokters')
      .onDelete('CASCADE');
    table
      .enu('status', ['terjadwal', 'berlangsung', 'selesai', 'dibatalkan'])
      .notNullable()
      .defaultTo('terjadwal');
    table.enu('tipe_konsultasi', ['chat', 'video_call']).notNullable();
    table.json('riwayat_chat');
    table.timestamp('mulai_pada');
    table.timestamp('selesai_pada');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('konsultasi');
};