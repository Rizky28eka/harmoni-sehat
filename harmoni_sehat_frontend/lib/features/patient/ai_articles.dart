import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/ui.dart';
import 'doctors.dart';

class AiChatController extends GetxController {
  final _api = Get.find<ApiClient>();
  final turns = <Map<String, dynamic>>[
    {'role': 'assistant', 'intro': true, 'content': 'Halo, saya Harmoni 👋 Ceritakan gejala atau pertanyaan kesehatan Anda. Saya bukan dokter, tetapi bisa membantu memberi informasi awal.'},
  ].obs;
  final input = TextEditingController();
  final scroll = ScrollController();
  final sending = false.obs;

  Future<void> send() async {
    final text = input.text.trim();
    if (text.isEmpty || sending.value) return;
    final history = turns.skip(1).map((t) => {'role': t['role'], 'content': t['content']}).toList();
    turns.add({'role': 'user', 'content': text});
    input.clear();
    sending.value = true;
    _down();
    try {
      final r = asMap(await _api.post('/gemini/chat', data: {'message': text, 'history': history}));
      turns.add({'role': 'assistant', 'content': r.s('reply'), 'meta': r});
    } catch (e) {
      turns.add({'role': 'assistant', 'content': e is ApiException ? e.message : 'Maaf, terjadi kesalahan.', 'error': true});
    } finally {
      sending.value = false;
      _down();
    }
  }

  void _down() => WidgetsBinding.instance.addPostFrameCallback((_) {
        if (scroll.hasClients) scroll.animateTo(scroll.position.maxScrollExtent + 120, duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
      });

  @override
  void onClose() {
    input.dispose();
    scroll.dispose();
    super.onClose();
  }
}

class AiChatView extends StatelessWidget {
  const AiChatView({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(AiChatController());
    final lilac = toneOf(context, Tone.lilac);
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [
          const ToneIcon(Icons.auto_awesome_rounded, tone: Tone.lilac, size: 38, round: true),
          const SizedBox(width: 10),
          Text('Asisten AI'.tr),
        ]),
      ),
      body: Column(children: [
        Expanded(
          child: Obx(() => ListView.builder(
                controller: c.scroll,
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                itemCount: c.turns.length + (c.sending.value ? 1 : 0),
                itemBuilder: (_, i) {
                  if (i >= c.turns.length) {
                    return Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                        decoration: BoxDecoration(color: lilac.bg, borderRadius: BorderRadius.circular(22)),
                        child: SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.4, color: lilac.ink)),
                      ),
                    );
                  }
                  return _turn(context, c.turns[i]);
                },
              )),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Row(children: [
              Expanded(
                child: TextField(
                  controller: c.input,
                  minLines: 1,
                  maxLines: 4,
                  maxLength: 1000,
                  buildCounter: (_, {required currentLength, required isFocused, maxLength}) => null,
                  textCapitalization: TextCapitalization.sentences,
                  onSubmitted: (_) => c.send(),
                  decoration: InputDecoration(hintText: 'Tulis gejala Anda…'.tr, border: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: const BorderSide(color: AppColors.primaryColor, width: 1.6))),
                ),
              ),
              const SizedBox(width: 10),
              Obx(() => IconButton.filled(style: IconButton.styleFrom(minimumSize: const Size(52, 52), backgroundColor: AppColors.primaryColor), onPressed: c.sending.value ? null : c.send, icon: const Icon(Icons.arrow_upward_rounded))),
            ]),
          ),
        ),
      ]),
    );
  }

  Widget _turn(BuildContext context, Map<String, dynamic> t) {
    final mine = t['role'] == 'user';
    final meta = asMap(t['meta']);
    final emergency = meta['emergency'] == true;
    final doctors = asList(meta['recommendedDoctors']);
    final tone = emergency ? Tone.rose : Tone.lilac;
    final tc = toneOf(context, tone);
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 5),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.84),
        decoration: BoxDecoration(
          color: mine ? null : tc.bg,
          gradient: mine ? const LinearGradient(colors: [Color(0xFF14B885), AppColors.primaryColor]) : null,
          borderRadius: BorderRadius.only(topLeft: const Radius.circular(22), topRight: const Radius.circular(22), bottomLeft: Radius.circular(mine ? 22 : 6), bottomRight: Radius.circular(mine ? 6 : 22)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (emergency) Padding(padding: const EdgeInsets.only(bottom: 6), child: Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.emergency_rounded, color: tc.ink), const SizedBox(width: 6), Text('Kemungkinan darurat'.tr, style: TextStyle(color: tc.ink, fontWeight: FontWeight.w800))])),
          Text(t['intro'] == true ? t['content'].toString().tr : t['content'].toString(), style: TextStyle(color: mine ? Colors.white : tc.ink, height: 1.45)),
          if (!mine && meta['urgency'] == 'high' && !emergency) Padding(padding: const EdgeInsets.only(top: 8), child: Pill('⚠ Disarankan segera ke dokter/IGD.'.tr, tone: Tone.rose)),
          if (doctors.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text('${'Dokter'.tr} ${meta.s('specialization')} ${'yang tersedia:'.tr}', style: TextStyle(fontWeight: FontWeight.w700, color: tc.ink)),
            const SizedBox(height: 6),
            for (var i = 0; i < doctors.length; i++) SizedBox(width: 280, child: DoctorCard(d: doctors[i], index: i)),
          ],
          if (!mine && meta['disclaimer'] != null) Padding(padding: const EdgeInsets.only(top: 6), child: Text(meta.s('disclaimer'), style: TextStyle(fontSize: 10.5, color: tc.ink.withValues(alpha: 0.7)))),
        ]),
      ),
    );
  }
}

class ArticlesController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  @override
  Future<List<Map<String, dynamic>>> fetch() async => asList(asMap(await _api.get('/health-articles', query: {'limit': 30}, cache: true))['data']);
}

class ArticlesView extends StatelessWidget {
  const ArticlesView({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.isRegistered<ArticlesController>() ? Get.find<ArticlesController>() : Get.put(ArticlesController());
    return Scaffold(
      appBar: AppBar(title: Text('Artikel kesehatan'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada artikel',
            emptyIcon: Icons.article_outlined,
            onRetry: c.load,
            builder: () => RefreshIndicator(
              onRefresh: c.load,
              child: ListView.builder(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
                itemCount: c.data.value!.length,
                itemBuilder: (_, i) {
                  final a = c.data.value![i];
                  final tone = const [Tone.butter, Tone.sky, Tone.rose, Tone.lilac, Tone.mint, Tone.peach][i % 6];
                  final ink = toneOf(context, tone).ink;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: SoftCard(
                      tone: tone,
                      variant: i,
                      radius: 28,
                      padding: const EdgeInsets.all(20),
                      onTap: () => Get.toNamed(AppRoutes.articleDetail, arguments: a.s('slug')),
                      child: Row(children: [
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(fmtDate(a['createdAt']), style: TextStyle(fontSize: 12, color: ink.withValues(alpha: 0.8), fontWeight: FontWeight.w600)),
                            const SizedBox(height: 6),
                            Text(a.s('judul'), maxLines: 3, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: ink, height: 1.25, letterSpacing: -0.3)),
                          ]),
                        ),
                        const SizedBox(width: 12),
                        Icon(Icons.arrow_forward_rounded, color: ink),
                      ]),
                    ),
                  );
                },
              ),
            ),
          )),
    );
  }
}

class ArticleDetailController extends LoadController<Map<String, dynamic>> {
  ArticleDetailController(this.slug);
  final String slug;
  @override
  Future<Map<String, dynamic>> fetch() async => asMap(await Get.find<ApiClient>().get('/health-articles/$slug', cache: true));
}

class ArticleDetailView extends StatelessWidget {
  const ArticleDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    final slug = Get.arguments as String;
    final c = Get.put(ArticleDetailController(slug), tag: slug);
    return Scaffold(
      appBar: AppBar(title: Text('Artikel'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            builder: () => ListView(padding: const EdgeInsets.fromLTRB(24, 8, 24, 40), children: [
              Pill(fmtDate(c.data.value!['createdAt']), tone: Tone.butter, icon: Icons.calendar_today_rounded),
              const SizedBox(height: 14),
              Text(c.data.value!.s('judul'), style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -0.8, height: 1.15)),
              const SizedBox(height: 20),
              Text(c.data.value!.s('konten'), style: const TextStyle(height: 1.7, fontSize: 16)),
            ]),
          )),
    );
  }
}
