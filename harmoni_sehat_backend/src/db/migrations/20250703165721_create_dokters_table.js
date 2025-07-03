/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('dokters', function (table) {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('nama_lengkap').notNullable();
    table.string('nomor_sip').notNullable().unique();
    table.string('spesialisasi');
    table.json('jadwal_praktek');
    table.decimal('biaya_konsultasi', 10, 2);
    table.integer('pengalaman_tahun');
    table.boolean('status_online').defaultTo(false);
    table.decimal('rating', 3, 2).defaultTo(0);
    table.json('sertifikat');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('dokters');
};