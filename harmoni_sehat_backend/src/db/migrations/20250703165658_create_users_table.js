/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('no_hp').notNullable().unique();
    table
      .enu('role', ['admin', 'dokter', 'apoteker', 'pasien'])
      .notNullable();
    table
      .enu('status_aktif', ['aktif', 'nonaktif', 'dibekukan'])
      .notNullable()
      .defaultTo('aktif');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};