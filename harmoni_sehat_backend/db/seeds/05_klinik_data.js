const { faker, NUM_KLINIK } = require('../seed_utils');

exports.seed = async function(knex) {
  console.log('Seeding klinik...');
  const klinikData = [];
  const tipeKlinikOptions = ['pratama', 'utama'];
  for (let i = 0; i < NUM_KLINIK; i++) {
    klinikData.push({
      nama_klinik: `Klinik ${faker.company.name()}`,
      alamat: faker.location.streetAddress(true),
      no_telepon: faker.phone.number(),
      email: faker.internet.email(),
      jam_buka: '08:00:00',
      jam_tutup: '20:00:00',
      koordinat_lat: faker.location.latitude(),
      koordinat_lng: faker.location.longitude(),
      is_24_jam: faker.datatype.boolean(),
      is_active: true,
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      tipe_klinik: faker.helpers.arrayElement(tipeKlinikOptions),
    });
  }
  await knex.batchInsert('klinik', klinikData, 1000);
  console.log(`Seeded ${klinikData.length} klinik.`);
};