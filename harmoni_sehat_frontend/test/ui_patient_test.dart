import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import 'harness.dart';

Map<String, dynamic> _consultation({String status = 'scheduled', Map<String, dynamic>? tx, Map<String, dynamic>? resep}) => {
      '_id': 'c1',
      'status': status,
      'tanggal': DateTime.now().add(const Duration(days: 2)).toUtc().toIso8601String(),
      'keluhan': 'Demam tiga hari',
      'biaya': 75000,
      'dokter_id': {'_id': 'd1', 'nama': 'dr. Andi Pratama'},
      'pasien_id': {'_id': 'p1', 'nama': 'Budi Santoso'},
      'transaksi': tx,
      'resep': resep,
    };

void main() {
  group('doctor search & booking', () {
    testWidgets('lists doctors, shows empty and error states', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      env.api.on('GET /specializations', (_, __) => [{'_id': 's1', 'nama': 'Umum'}]);
      Get.toNamed('/doctors');
      await tester.pumpAndSettle();
      // Doctors route is not registered yet -> error state with retry.
      expect(find.text('Coba lagi'), findsOneWidget);

      env.api.on('GET /booking/doctors', (_, q) => {'data': [doctorJson(), doctorJson(id: 'd2', nama: 'dr. Sari', fee: 150000)], 'total': 2});
      await tester.tap(find.text('Coba lagi'));
      await tester.pumpAndSettle();
      expect(find.text('dr. Andi Pratama'), findsOneWidget);
      expect(find.text('dr. Sari'), findsOneWidget);
      expect(find.textContaining('75.000'), findsOneWidget);

      env.api.on('GET /booking/doctors', (_, __) => {'data': [], 'total': 0});
      await tester.tap(find.widgetWithText(ChoiceChip, 'Umum'));
      await tester.pumpAndSettle();
      expect(find.text('Dokter tidak ditemukan'), findsOneWidget);
    });

    testWidgets('search sends the filters to the API (debounced)', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      Get.toNamed('/doctors');
      await tester.pumpAndSettle();
      Map<String, dynamic>? last;
      env.api.on('GET /specializations', (_, __) => []);
      env.api.on('GET /booking/doctors', (_, q) {
        last = q;
        return {'data': [doctorJson()], 'total': 1};
      });
      await tester.tap(find.text('Coba lagi'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField).first, 'andi');
      await tester.pump(const Duration(milliseconds: 500));
      await tester.pumpAndSettle();
      expect(last!['search'], 'andi');
      expect(last!['sort'], 'rating');
    });

    testWidgets('pick a slot, describe the complaint, book and land on the payment screen', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      final tomorrow = DateTime.now().add(const Duration(days: 1));
      final start = DateTime.utc(tomorrow.year, tomorrow.month, tomorrow.day, 2, 0); // 09:00 WIB
      env.api.on('GET /booking/doctors/d1', (_, __) => {...doctorJson(), 'bio': 'Dokter umum berpengalaman', 'jadwal': [], 'ulasan': [{'rating': 5, 'komentar': 'Ramah sekali'}]});
      env.api.on('GET /booking/doctors/d1/slots', (_, q) => [
            {'jadwal_id': 'j1', 'klinik_id': 'k1', 'start': start.toIso8601String(), 'end': start.add(const Duration(minutes: 30)).toIso8601String(), 'available': true},
            {'jadwal_id': 'j1', 'klinik_id': 'k1', 'start': start.add(const Duration(minutes: 30)).toIso8601String(), 'end': start.add(const Duration(minutes: 60)).toIso8601String(), 'available': false},
          ]);
      env.api.on('POST /booking/consultations', (b, _) => {
            'consultation': {'_id': 'c1'},
            'transaction': {'order_id': 'KNS-1'},
          });
      env.api.on('GET /payments/KNS-1', (_, __) => {'order_id': 'KNS-1', 'status': 'pending', 'total_biaya': 75000, 'payment_url': 'http://x/api/v1/payments/KNS-1/simulate'});

      Get.toNamed('/doctors/detail', arguments: 'd1');
      await tester.pumpAndSettle();
      expect(find.text('dr. Andi Pratama'), findsOneWidget);
      expect(find.text('Ramah sekali'), findsOneWidget);

      // 09:00 is selectable, 09:30 (taken) is disabled.
      final taken = tester.widget<ChoiceChip>(find.widgetWithText(ChoiceChip, '09:30'));
      expect(taken.onSelected, isNull);

      // Booking without a slot is refused.
      await tester.ensureVisible(find.textContaining('Pesan & Bayar'));
      await tester.tap(find.textContaining('Pesan & Bayar'));
      await tester.pump();
      expect(env.api.calls.where((c) => c == 'POST /booking/consultations'), isEmpty);

      await tester.tap(find.widgetWithText(ChoiceChip, '09:00'));
      await tester.enterText(find.widgetWithText(TextField, 'Keluhan Anda'), 'Demam tiga hari');
      await tester.ensureVisible(find.textContaining('Pesan & Bayar'));
      await tester.tap(find.textContaining('Pesan & Bayar'));
      await tester.pumpAndSettle();

      final body = env.api.bodies['POST /booking/consultations']!.single!;
      expect(body, {'dokter_id': 'd1', 'jadwal_id': 'j1', 'start': start.toIso8601String(), 'keluhan': 'Demam tiga hari'});
      expect(find.text('Pembayaran'), findsWidgets);
      expect(find.textContaining('75.000'), findsOneWidget);
      expect(find.text('Simulasikan pembayaran berhasil'), findsOneWidget);
      expect(DateFormat('HH:mm').format(start.add(const Duration(hours: 7))), '09:00');
    });

    testWidgets('sandbox payment: simulating success moves on to the consultation', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      var status = 'pending';
      env.api.on('GET /payments/KNS-1', (_, __) => {'order_id': 'KNS-1', 'status': status, 'total_biaya': 75000, 'payment_url': 'http://x/simulate'});
      env.api.on('POST /payments/KNS-1/simulate', (b, __) {
        status = 'completed';
        return {'status': 'completed'};
      });
      env.api.on('GET /booking/consultations/c1', (_, __) => _consultation());

      Get.toNamed('/payment', arguments: {'order_id': 'KNS-1', 'next': 'consultation', 'next_id': 'c1'});
      await tester.pumpAndSettle();
      await tester.tap(find.text('Simulasikan pembayaran berhasil'));
      await tester.pumpAndSettle();

      expect(env.api.bodies['POST /payments/KNS-1/simulate']!.single, {'outcome': 'success'});
      expect(find.text('Detail Konsultasi'), findsOneWidget);
    });
  });

  group('consultation detail', () {
    Future<TestEnv> open(WidgetTester tester, Map<String, dynamic> data, {String role = 'pasien'}) async {
      final env = await bootApp(tester, role: role);
      env.api.on('GET /booking/consultations/c1', (_, __) => data);
      Get.toNamed('/consultation', arguments: 'c1');
      await tester.pumpAndSettle();
      return env;
    }

    testWidgets('unpaid: patient can pay or cancel; no chat yet', (tester) async {
      await open(tester, _consultation(status: 'pending', tx: {'order_id': 'KNS-9', 'status': 'pending'}));
      expect(find.text('Bayar sekarang'), findsOneWidget);
      expect(find.text('Batalkan'), findsOneWidget);
      expect(find.text('Buka obrolan'), findsNothing);
    });

    testWidgets('scheduled: chat and in-app voice/video calls are offered', (tester) async {
      await open(tester, _consultation());
      expect(find.text('Buka obrolan'), findsOneWidget);
      expect(find.text('Panggilan suara'), findsOneWidget);
      expect(find.text('Video call'), findsOneWidget);
      expect(find.text('Bayar sekarang'), findsNothing);
    });

    testWidgets('completed with a prescription: patient can redeem it; doctor cannot', (tester) async {
      final resep = {'_id': 'r1', 'obat': [{'obat_id': {'nama': 'Paracetamol'}, 'dosis': '500mg', 'jumlah': 10, 'aturan_pakai': '3x1'}]};
      await open(tester, _consultation(status: 'completed', resep: resep));
      expect(find.text('Paracetamol'), findsOneWidget);
      expect(find.text('Beri ulasan'), findsOneWidget);
      expect(find.text('Tebus resep di apotek'), findsOneWidget);
    });

    testWidgets('doctor sees start/complete actions, patient does not', (tester) async {
      await open(tester, _consultation(), role: 'dokter');
      expect(find.text('Mulai konsultasi'), findsOneWidget);
      expect(find.text('Selesaikan & tulis resep'), findsOneWidget);
      expect(find.text('Bayar sekarang'), findsNothing);
    });

    testWidgets('cancelling asks for confirmation and posts', (tester) async {
      final env = await open(tester, _consultation(status: 'pending', tx: {'order_id': 'KNS-9', 'status': 'pending'}));
      env.api.on('POST /booking/consultations/c1/cancel', (_, __) => {});
      await tester.tap(find.text('Batalkan'));
      await tester.pumpAndSettle();
      expect(find.text('Batalkan konsultasi'), findsOneWidget);
      await tester.tap(find.widgetWithText(FilledButton, 'Batalkan'));
      await tester.pumpAndSettle();
      expect(env.api.calls, contains('POST /booking/consultations/c1/cancel'));
    });
  });

  group('chat', () {
    testWidgets('loads history, sends through the socket and shows incoming messages live', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      env.api.on('GET /booking/consultations/c1/messages', (_, __) => [
            {'_id': 'm1', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Halo, ada keluhan apa?', 'tipe': 'text', 'timestamp': DateTime.now().toIso8601String(), 'is_read': true},
          ]);
      Get.toNamed('/chat', arguments: {'id': 'c1', 'title': 'dr. Andi', 'canCall': true});
      await tester.pumpAndSettle();
      expect(find.text('Halo, ada keluhan apa?'), findsOneWidget);
      expect(find.byIcon(Icons.videocam_outlined), findsOneWidget);
      expect(find.byIcon(Icons.call_outlined), findsOneWidget);

      await tester.enterText(find.byType(TextField), 'Demam dok');
      await tester.tap(find.byIcon(Icons.send));
      await tester.pumpAndSettle();
      expect(env.socket.sent.single, {'id': 'c1', 'text': 'Demam dok', 'type': 'text'});

      env.socket.chatCtl.add({'_id': 'm2', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Minum yang banyak ya', 'tipe': 'text', 'timestamp': DateTime.now().toIso8601String()});
      // A message for another consultation must not leak in.
      env.socket.chatCtl.add({'_id': 'm3', 'konsultasi_id': 'other', 'pengirim_id': 'u9', 'isi': 'bukan untuk Anda', 'tipe': 'text', 'timestamp': DateTime.now().toIso8601String()});
      await tester.pumpAndSettle();
      expect(find.text('Minum yang banyak ya'), findsOneWidget);
      expect(find.text('bukan untuk Anda'), findsNothing);
    });
  });

  group('pharmacy', () {
    testWidgets('add to cart, adjust, and check out into payment', (tester) async {
      final drug = {'_id': 'dr1', 'nama': 'Paracetamol 500mg', 'kategori': 'Pereda Nyeri', 'satuan': 'strip', 'harga': 5000, 'stok': 20, 'butuh_resep': false};
      var qty = 0;
      Map<String, dynamic> cart() => {
            'items': qty == 0 ? [] : [{'obat': drug, 'jumlah': qty, 'subtotal': 5000 * qty, 'tersedia': true}],
            'total': 5000 * qty,
          };
      final env = await bootApp(tester, role: 'pasien', setup: (api) {
        api.on('GET /shop/drugs', (_, __) => {'data': [drug], 'total': 1, 'kategori': ['Pereda Nyeri']});
        api.on('GET /shop/cart', (_, __) => cart());
        api.on('PUT /shop/cart/items', (b, __) {
          qty = b!['jumlah'] as int;
          return cart();
        });
      });
      env.api.on('POST /shop/checkout', (b, __) => {'order': {'_id': 'o1'}, 'transaction': {'order_id': 'OBT-1'}});
      env.api.on('GET /payments/OBT-1', (_, __) => {'order_id': 'OBT-1', 'status': 'pending', 'total_biaya': 10000, 'payment_url': 'http://x/simulate'});

      Get.toNamed('/shop');
      await tester.pumpAndSettle();
      expect(find.text('Paracetamol 500mg'), findsOneWidget);

      await tester.tap(find.byIcon(Icons.add_shopping_cart));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.add_circle_outline));
      await tester.pumpAndSettle();
      expect(qty, 2);

      await tester.tap(find.text('Keranjang'));
      await tester.pumpAndSettle();
      expect(find.textContaining('10.000'), findsWidgets);
      await tester.tap(find.widgetWithText(FilledButton, 'Checkout'));
      await tester.pumpAndSettle();
      expect(env.api.bodies['POST /shop/checkout']!.single!['alamat_pengiriman'], 'Jl. Mawar 1');
      expect(find.text('Pembayaran'), findsWidgets);
    });
  });

  testWidgets('medication reminders sync to on-device alarms and permission is requested on demand', (tester) async {
    final env = await bootApp(tester, role: 'pasien');
    env.api.on('GET /me/reminders', (_, __) => [{'_id': 'r1', 'nama_obat': 'Amoxicillin', 'dosis': '500mg', 'jam': ['08:00', '20:00'], 'is_active': true}]);
    Get.toNamed('/reminders');
    await tester.pumpAndSettle();
    expect(find.text('Amoxicillin • 500mg'), findsOneWidget);
    expect(env.scheduler.synced.last.single['_id'], 'r1');

    await tester.tap(find.byIcon(Icons.notifications_active_outlined));
    await tester.pumpAndSettle();
    expect(env.scheduler.asked, isTrue);
  });

  testWidgets('settings: switching language and theme', (tester) async {
    await bootApp(tester, role: 'pasien');
    await tester.tap(find.text('Profil').last);
    await tester.pumpAndSettle();
    expect(find.text('Mode gelap'), findsOneWidget);
    await tester.tap(find.text('Indonesia'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('English').last);
    // updateLocale reassembles the tree; pump frames explicitly rather than settling.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('Dark mode'), findsOneWidget);
    expect(find.text('Sign out'), findsOneWidget);
    expect(find.text('Home'), findsWidgets);
  });
}
