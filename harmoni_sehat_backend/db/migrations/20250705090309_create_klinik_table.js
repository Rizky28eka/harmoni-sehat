/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('klinik', function(table) {
    table.increments('klinik_id').primary();
    table.string('nama_klinik', 255).notNullable();
    table.text('alamat');
    table.string('no_telepon', 20);
    table.string('email', 255).unique();
    table.time('jam_buka');
    table.time('jam_tutup');
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.string('foto_klinik', 255);
    table.boolean('is_24_jam').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.enum('tipe_klinik', ['pratama', 'utama']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('klinik');
};