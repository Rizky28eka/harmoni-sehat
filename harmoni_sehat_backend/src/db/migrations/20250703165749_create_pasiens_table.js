/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('pasiens', function (table) {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('nama_lengkap').notNullable();
    table.date('tanggal_lahir');
    table.enu('jenis_kelamin', ['pria', 'wanita', 'lainnya']);
    table.string('golongan_darah');
    table.integer('tinggi_badan_cm');
    table.decimal('berat_badan_kg', 5, 2);
    table.text('alamat');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('pasiens');
};