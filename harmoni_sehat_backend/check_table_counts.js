
const knexConfig = require('./knexfile.js').development;
const knex = require('knex')(knexConfig);

async function checkTableCounts() {
  try {
    const tablesResult = await knex.raw('SHOW TABLES');
    const tables = tablesResult[0].map(row => Object.values(row)[0]);

    console.log('Menghitung jumlah data di setiap tabel...');
    for (const table of tables) {
      const countResult = await knex(table).count('* as count');
      const count = countResult[0].count;
      console.log(`- ${table}: ${count}`);
    }
  } catch (error) {
    console.error('Error saat memeriksa tabel:', error);
  } finally {
    await knex.destroy();
  }
}

checkTableCounts();
