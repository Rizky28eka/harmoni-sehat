const express = require('express');
const cors = require('cors');
const authRoutes = require('./api/auth/auth.route');
const pasienRoutes = require('./api/pasien/pasien.route');
const doctorRoutes = require('./api/doctor/doctor.route');
const obatRoutes = require('./api/obat/obat.route');
const apotekRoutes = require('./api/apotek/apotek.route');
const konsultasiRoutes = require('./api/konsultasi/konsultasi.route');
const resepRoutes = require('./api/resep/resep.route');
const artikelKesehatanRoutes = require('./api/artikelkesehatan/artikelkesehatan.route');
const kategoriArtikelRoutes = require('./api/kategoriartikel/kategoriartikel.route');
const kategoriObatRoutes = require('./api/kategoriobat/kategoriobat.route');
const spesialisasiRoutes = require('./api/spesialisasi/spesialisasi.route');
const rumahSakitRoutes = require('./api/rumahsakit/rumahsakit.route');
const klinikRoutes = require('./api/klinik/klinik.route');
const userRoutes = require('./api/user/user.route');
const adminRoutes = require('./api/admin/admin.route');
const apotekerRoutes = require('./api/apoteker/apoteker.route');
const kurirRoutes = require('./api/kurir/kurir.route');
const promoRoutes = require('./api/promo/promo.route');
const pembayaranRoutes = require('./api/pembayaran/pembayaran.route');
const userPromoRoutes = require('./api/userpromo/userpromo.route');
const stokObatRoutes = require('./api/stokobat/stokobat.route');
const pengirimanRoutes = require('./api/pengiriman/pengiriman.route');
const detailResepRoutes = require('./api/detailresep/detailresep.route');
const medicalRecordRoutes = require('./api/medicalrecord/medicalrecord.route');
const vitalSignsRoutes = require('./api/vitalsigns/vitalsigns.route');
const notifikasiRoutes = require('./api/notifikasi/notifikasi.route');
const reviewRatingRoutes = require('./api/reviewrating/reviewrating.route');
const feedbackRoutes = require('./api/feedback/feedback.route');
const chatMessageRoutes = require('./api/chatmessage/chatmessage.route');
const jadwalDoctorRoutes = require('./api/jadwaldoctor/jadwaldoctor.route');
const appointmentRoutes = require('./api/appointment/appointment.route');
const chatSessionRoutes = require('./api/chatsession/chatsession.route');
const auditTrailRoutes = require('./api/audittrail/audittrail.route');
const appAnalyticsRoutes = require('./api/appanalytics/appanalytics.route');
const provinsiRoutes = require('./api/provinsi/provinsi.route');
const kotaRoutes = require('./api/kota/kota.route');
const faqRoutes = require('./api/faq/faq.route');
const systemSettingsRoutes = require('./api/systemsettings/systemsettings.route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pasiens', pasienRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/obats', obatRoutes);
app.use('/api/apoteks', apotekRoutes);
app.use('/api/konsultasis', konsultasiRoutes);
app.use('/api/reseps', resepRoutes);
app.use('/api/artikelkesehatans', artikelKesehatanRoutes);
app.use('/api/kategoriartikels', kategoriArtikelRoutes);
app.use('/api/kategoriobats', kategoriObatRoutes);
app.use('/api/spesialisasis', spesialisasiRoutes);
app.use('/api/rumahsakit', rumahSakitRoutes);
app.use('/api/kliniks', klinikRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/apotekers', apotekerRoutes);
app.use('/api/kurirs', kurirRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/pembayarans', pembayaranRoutes);
app.use('/api/userpromos', userPromoRoutes);
app.use('/api/stokobats', stokObatRoutes);
app.use('/api/pengirimans', pengirimanRoutes);
app.use('/api/detailreseps', detailResepRoutes);
app.use('/api/medicalrecords', medicalRecordRoutes);
app.use('/api/vitalsigns', vitalSignsRoutes);
app.use('/api/notifikasis', notifikasiRoutes);
app.use('/api/reviewratings', reviewRatingRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/chatmessages', chatMessageRoutes);
app.use('/api/jadwaldoctors', jadwalDoctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chatsessions', chatSessionRoutes);
app.use('/api/audittrails', auditTrailRoutes);
app.use('./api/appanalytics', appAnalyticsRoutes);
app.use('/api/provinsis', provinsiRoutes);
app.use('/api/kotas', kotaRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/systemsettings', systemSettingsRoutes);


// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;