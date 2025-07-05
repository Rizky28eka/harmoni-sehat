const indonesiaLocations = [
  {
    provinsi: "Aceh",
    kota_kabupaten: [
      "Banda Aceh", "Langsa", "Lhokseumawe", "Sabang", "Subulussalam",
      "Aceh Barat", "Aceh Barat Daya", "Aceh Besar", "Aceh Jaya", "Aceh Selatan", "Aceh Singkil", "Aceh Tamiang", "Aceh Tengah", "Aceh Tenggara", "Aceh Timur", "Aceh Utara", "Bener Meriah", "Bireuen", "Gayo Lues", "Nagan Raya", "Pidie", "Pidie Jaya", "Simeulue"
    ]
  },
  {
    provinsi: "Sumatera Utara",
    kota_kabupaten: [
      "Medan", "Binjai", "Gunungsitoli", "Padangsidimpuan", "Pematangsiantar", "Sibolga", "Tanjungbalai", "Tebing Tinggi",
      "Asahan", "Batubara", "Dairi", "Deli Serdang", "Humbang Hasundutan", "Karo", "Labuhanbatu", "Labuhanbatu Selatan", "Labuhanbatu Utara", "Langkat", "Mandailing Natal", "Nias", "Nias Barat", "Nias Selatan", "Nias Utara", "Padang Lawas", "Padang Lawas Utara", "Pakpak Bharat", "Samosir", "Serdang Bedagai", "Simalungun", "Tapanuli Selatan", "Tapanuli Tengah", "Tapanuli Utara", "Toba Samosir"
    ]
  },
  {
    provinsi: "Sumatera Barat",
    kota_kabupaten: [
      "Padang", "Bukittinggi", "Padangpanjang", "Pariaman", "Payakumbuh", "Sawahlunto", "Solok",
      "Agam", "Dharmasraya", "Kepulauan Mentawai", "Lima Puluh Kota", "Padang Pariaman", "Pasaman", "Pasaman Barat", "Pesisir Selatan", "Sijunjung", "Kabupaten Solok", "Solok Selatan", "Tanah Datar"
    ]
  },
  {
    provinsi: "Riau",
    kota_kabupaten: [
      "Pekanbaru", "Dumai",
      "Bengkalis", "Indragiri Hilir", "Indragiri Hulu", "Kampar", "Kepulauan Meranti", "Kuantan Singingi", "Pelalawan", "Rokan Hilir", "Rokan Hulu", "Siak"
    ]
  },
  {
    provinsi: "Kepulauan Riau",
    kota_kabupaten: [
      "Batam", "Tanjungpinang",
      "Bintan", "Karimun", "Kepulauan Anambas", "Lingga", "Natuna"
    ]
  },
  {
    provinsi: "Jambi",
    kota_kabupaten: [
      "Jambi", "Sungai Penuh",
      "Batanghari", "Bungo", "Kerinci", "Merangin", "Muaro Jambi", "Sarolangun", "Tanjung Jabung Barat", "Tanjung Jabung Timur", "Tebo"
    ]
  },
  {
    provinsi: "Sumatera Selatan",
    kota_kabupaten: [
      "Palembang", "Lubuklinggau", "Pagar Alam", "Prabumulih",
      "Banyuasin", "Empat Lawas", "Lahat", "Muara Enim", "Musi Banyuasin", "Musi Rawas", "Musi Rawas Utara", "Ogan Ilir", "Ogan Komering Ilir", "Ogan Komering Ulu", "Ogan Komering Ulu Selatan", "Ogan Komering Ulu Timur", "Penukal Abab Lematang Ilir"
    ]
  },
  {
    provinsi: "Bangka Belitung",
    kota_kabupaten: [
      "Pangkalpinang",
      "Bangka", "Bangka Barat", "Bangka Selatan", "Bangka Tengah", "Belitung", "Belitung Timur"
    ]
  },
  {
    provinsi: "Bengkulu",
    kota_kabupaten: [
      "Bengkulu",
      "Bengkulu Selatan", "Bengkulu Tengah", "Bengkulu Utara", "Kaur", "Kepahiang", "Lebong", "Mukomuko", "Rejang Lebong", "Seluma"
    ]
  },
  {
    provinsi: "Lampung",
    kota_kabupaten: [
      "Bandar Lampung", "Metro",
      "Lampung Barat", "Lampung Selatan", "Lampung Tengah", "Lampung Timur", "Lampung Utara", "Mesuji", "Pesawaran", "Pesisir Barat", "Pringsewu", "Tanggamus", "Tulang Bawang", "Tulang Bawang Barat", "Way Kanan"
    ]
  },
  {
    provinsi: "DKI Jakarta",
    kota_kabupaten: [
      "Jakarta Barat", "Jakarta Pusat", "Jakarta Selatan", "Jakarta Timur", "Jakarta Utara",
      "Kepulauan Seribu"
    ]
  },
  {
    provinsi: "Jawa Barat",
    kota_kabupaten: [
      "Bandung", "Bekasi", "Bogor", "Cimahi", "Cirebon", "Depok", "Sukabumi", "Tasikmalaya", "Banjar",
      "Kabupaten Bandung", "Bandung Barat", "Kabupaten Bekasi", "Kabupaten Bogor", "Ciamis", "Cianjur", "Kabupaten Cirebon", "Garut", "Indramayu", "Karawang", "Kuningan", "Majalengka", "Pangandaran", "Purwakarta", "Subang", "Kabupaten Sukabumi", "Sumedang", "Kabupaten Tasikmalaya"
    ]
  },
  {
    provinsi: "Jawa Tengah",
    kota_kabupaten: [
      "Semarang", "Magelang", "Pekalongan", "Salatiga", "Surakarta", "Tegal",
      "Banjarnegara", "Banyumas", "Batang", "Blora", "Boyolali", "Brebes", "Cilacap", "Demak", "Grobogan", "Jepara", "Karanganyar", "Kebumen", "Kendal", "Klaten", "Kudus", "Kabupaten Magelang", "Pati", "Kabupaten Pekalongan", "Pemalang", "Purbalingga", "Purworejo", "Rembang", "Kabupaten Semarang", "Sragen", "Sukoharjo", "Kabupaten Tegal", "Temanggung", "Wonogiri", "Wonosobo"
    ]
  },
  {
    provinsi: "DI Yogyakarta",
    kota_kabupaten: [
      "Yogyakarta",
      "Bantul", "Gunung Kidul", "Kulon Progo", "Sleman"
    ]
  },
  {
    provinsi: "Jawa Timur",
    kota_kabupaten: [
      "Surabaya", "Malang", "Batu", "Blitar", "Kediri", "Madiun", "Mojokerto", "Pasuruan", "Probolinggo",
      "Bangkalan", "Banyuwangi", "Kabupaten Blitar", "Bojonegoro", "Bondowoso", "Gresik", "Jember", "Jombang", "Kabupaten Kediri", "Lamongan", "Lumajang", "Kabupaten Madiun", "Magetan", "Kabupaten Malang", "Kabupaten Mojokerto", "Nganjuk", "Ngawi", "Pacitan", "Pamekasan", "Kabupaten Pasuruan", "Kabupaten Probolinggo", "Sampang", "Sidoarjo", "Situbondo", "Sumenep", "Trenggalek", "Tuban", "Tulungagung"
    ]
  },
  {
    provinsi: "Banten",
    kota_kabupaten: [
      "Serang", "Tangerang", "Tangerang Selatan", "Cilegon",
      "Lebak", "Pandeglang", "Kabupaten Serang", "Kabupaten Tangerang"
    ]
  },
  {
    provinsi: "Bali",
    kota_kabupaten: [
      "Denpasar",
      "Badung", "Bangli", "Buleleng", "Gianyar", "Jembrana", "Karangasem", "Klungkung", "Tabanan"
    ]
  },
  {
    provinsi: "Nusa Tenggara Barat",
    kota_kabupaten: [
      "Mataram", "Bima",
      "Kabupaten Bima", "Dompu", "Lombok Barat", "Lombok Tengah", "Lombok Timur", "Lombok Utara", "Sumbawa", "Sumbawa Barat"
    ]
  },
  {
    provinsi: "Nusa Tenggara Timur",
    kota_kabupaten: [
      "Kupang",
      "Alor", "Belu", "Ende", "Flores Timur", "Kabupaten Kupang", "Lembata", "Manggarai", "Manggarai Barat", "Manggarai Timur", "Nagekeo", "Ngada", "Rote Ndao", "Sabu Raijua", "Sikka", "Sumba Barat", "Sumba Barat Daya", "Sumba Tengah", "Sumba Timur", "Timor Tengah Selatan", "Timor Tengah Utara", "Malaka"
    ]
  },
  {
    provinsi: "Kalimantan Barat",
    kota_kabupaten: [
      "Pontianak", "Singkawang",
      "Bengkayang", "Kapuas Hulu", "Kayong Utara", "Ketapang", "Kubu Raya", "Landak", "Melawi", "Sambas", "Sanggau", "Sekadau", "Sintang"
    ]
  },
  {
    provinsi: "Kalimantan Tengah",
    kota_kabupaten: [
      "Palangka Raya",
      "Barito Selatan", "Barito Timur", "Barito Utara", "Gunung Mas", "Kapuas", "Katingan", "Kotawaringin Barat", "Kotawaringin Timur", "Lamandau", "Murung Raya", "Pulang Pisau", "Sukamara", "Seruyan"
    ]
  },
  {
    provinsi: "Kalimantan Selatan",
    kota_kabupaten: [
      "Banjarmasin", "Banjarbaru",
      "Balangan", "Kabupaten Banjar", "Barito Kuala", "Hulu Sungai Selatan", "Hulu Sungai Tengah", "Hulu Sungai Utara", "Kotabaru", "Tabalong", "Tanah Bumbu", "Tanah Laut", "Tapin"
    ]
  },
  {
    provinsi: "Kalimantan Timur",
    kota_kabupaten: [
      "Samarinda", "Balikpapan", "Bontang",
      "Berau", "Kutai Barat", "Kutai Kartanegara", "Kutai Timur", "Mahakam Ulu", "Paser", "Penajam Paser Utara"
    ]
  },
  {
    provinsi: "Kalimantan Utara",
    kota_kabupaten: [
      "Tarakan",
      "Bulungan", "Malinau", "Nunukan", "Tana Tidung"
    ]
  },
  {
    provinsi: "Sulawesi Utara",
    kota_kabupaten: [
      "Manado", "Bitung", "Kotamobagu", "Tomohon",
      "Bolaang Mongondow", "Bolaang Mongondow Selatan", "Bolaang Mongondow Timur", "Bolaang Mongondow Utara", "Kepulauan Sangihe", "Kepulauan Siau Tagulandang Biaro", "Kepulauan Talaud", "Minahasa", "Minahasa Selatan", "Minahasa Tenggara", "Minahasa Utara"
    ]
  },
  {
    provinsi: "Sulawesi Tengah",
    kota_kabupaten: [
      "Palu",
      "Banggai", "Banggai Kepulauan", "Banggai Laut", "Buol", "Donggala", "Morowali", "Morowali Utara", "Parigi Moutong", "Poso", "Sigi", "Tojo Una-Una", "Toli-Toli"
    ]
  },
  {
    provinsi: "Sulawesi Selatan",
    kota_kabupaten: [
      "Makassar", "Palopo", "Parepare",
      "Bantaeng", "Barru", "Bone", "Bulukumba", "Enrekang", "Gowa", "Jeneponto", "Kepulauan Selayar", "Luwu", "Luwu Timur", "Luwu Utara", "Maros", "Pangkajene dan Kepulauan", "Pinrang", "Sidenreng Rappang", "Sinjai", "Soppeng", "Takalar", "Tana Toraja", "Toraja Utara", "Wajo"
    ]
  },
  {
    provinsi: "Sulawesi Tenggara",
    kota_kabupaten: [
      "Kendari", "Bau-Bau",
      "Bombana", "Buton", "Buton Selatan", "Buton Tengah", "Buton Utara", "Kolaka", "Kolaka Timur", "Kolaka Utara", "Konawe", "Konawe Kepulauan", "Konawe Selatan", "Konawe Utara", "Muna", "Muna Barat", "Wakatobi"
    ]
  },
  {
    provinsi: "Gorontalo",
    kota_kabupaten: [
      "Gorontalo",
      "Boalemo", "Bone Bolango", "Kabupaten Gorontalo", "Gorontalo Utara", "Pohuwato"
    ]
  },
  {
    provinsi: "Sulawesi Barat",
    kota_kabupaten: [
      // No cities listed
      "Majene", "Mamasa", "Mamuju", "Mamuju Tengah", "Mamuju Utara", "Polewali Mandar"
    ]
  },
  {
    provinsi: "Maluku",
    kota_kabupaten: [
      "Ambon", "Tual",
      "Buru", "Buru Selatan", "Kepulauan Aru", "Maluku Barat Daya", "Maluku Tengah", "Maluku Tenggara", "Maluku Tenggara Barat", "Seram Bagian Barat", "Seram Bagian Timur"
    ]
  },
  {
    provinsi: "Maluku Utara",
    kota_kabupaten: [
      "Ternate", "Tidore Kepulauan",
      "Halmahera Barat", "Halmahera Selatan", "Halmahera Tengah", "Halmahera Timur", "Halmahera Utara", "Kepulauan Sula", "Pulau Morotai", "Pulau Taliabu"
    ]
  },
  {
    provinsi: "Papua Barat",
    kota_kabupaten: [
      "Sorong",
      "Fakfak", "Kaimana", "Manokwari", "Manokwari Selatan", "Maybrat", "Pegunungan Arfak", "Raja Ampat", "Kabupaten Sorong", "Sorong Selatan", "Tambrauw", "Teluk Bintuni", "Teluk Wondama"
    ]
  },
  {
    provinsi: "Papua",
    kota_kabupaten: [
      "Jayapura",
      "Asmat", "Biak Numfor", "Boven Digoel", "Deiyai", "Dogiyai", "Intan Jaya", "Kabupaten Jayapura", "Jayawijaya", "Keerom", "Kepulauan Yapen", "Lanny Jaya", "Mamberamo Raya", "Mamberamo Tengah", "Mappi", "Merauke", "Mimika", "Nabire", "Nduga", "Paniai", "Pegunungan Bintang", "Puncak", "Puncak Jaya", "Sarmi", "Supiori", "Tolikara", "Waropen", "Yahukimo", "Yalimo"
    ]
  },
  {
    provinsi: "Papua Selatan",
    kota_kabupaten: [
      // No cities listed
      "Asmat", "Boven Digoel", "Mappi", "Merauke"
    ]
  },
  {
    provinsi: "Papua Tengah",
    kota_kabupaten: [
      // No cities listed
      "Deiyai", "Dogiyai", "Intan Jaya", "Mimika", "Nabire", "Paniai", "Puncak", "Puncak Jaya"
    ]
  },
  {
    provinsi: "Papua Pegunungan",
    kota_kabupaten: [
      // No cities listed
      "Jayawijaya", "Lanny Jaya", "Mamberamo Tengah", "Nduga", "Pegunungan Bintang", "Tolikara", "Yahukimo", "Yalimo"
    ]
  },
  {
    provinsi: "Papua Barat Daya",
    kota_kabupaten: [
      // No cities listed
      "Fakfak", "Kaimana", "Manokwari", "Manokwari Selatan", "Maybrat", "Pegunungan Arfak", "Raja Ampat", "Sorong", "Sorong Selatan", "Tambrauw", "Teluk Bintuni", "Teluk Wondama"
    ]
  }
];

module.exports = indonesiaLocations;
