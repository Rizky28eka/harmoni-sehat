import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/ui.dart';
import 'doctors.dart';

class AiChatController extends GetxController {
  final _api = Get.find<ApiClient>();
  final turns = <Map<String, dynamic>>[
    {'role': 'assistant', 'content': 'Halo, saya Harmoni 👋 Ceritakan gejala atau pertanyaan kesehatan Anda. Saya bukan dokter, tetapi bisa membantu memberi informasi awal.'},
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
    return Scaffold(
      appBar: AppBar(title: Text('Asisten AI'.tr)),
      body: Column(children: [
        Expanded(
          child: Obx(() => ListView.builder(
                controller: c.scroll,
                padding: const EdgeInsets.all(12),
                itemCount: c.turns.length + (c.sending.value ? 1 : 0),
                itemBuilder: (_, i) {
                  if (i >= c.turns.length) return const Align(alignment: Alignment.centerLeft, child: Padding(padding: EdgeInsets.all(12), child: SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2))));
                  return _turn(context, c.turns[i]);
                },
              )),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
            child: Row(children: [
              Expanded(child: TextField(controller: c.input, minLines: 1, maxLines: 4, maxLength: 1000, buildCounter: (_, {required currentLength, required isFocused, maxLength}) => null, textCapitalization: TextCapitalization.sentences, onSubmitted: (_) => c.send(), decoration: InputDecoration(hintText: 'Tulis gejala Anda…'.tr, filled: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none)))),
              const SizedBox(width: 8),
              Obx(() => IconButton.filled(onPressed: c.sending.value ? null : c.send, icon: const Icon(Icons.send))),
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
    final scheme = Theme.of(context).colorScheme;
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.all(12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        decoration: BoxDecoration(
          color: mine ? scheme.primary : emergency ? Colors.red.withValues(alpha: 0.12) : scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(14),
          border: emergency ? Border.all(color: Colors.red) : null,
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (emergency) Row(children: [Icon(Icons.emergency, color: Colors.red), SizedBox(width: 6), Text('Kemungkinan darurat'.tr, style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold))]),
          Text(t['content'].toString(), style: TextStyle(color: mine ? Colors.white : null)),
          if (!mine && meta['urgency'] == 'high' && !emergency) Padding(padding: EdgeInsets.only(top: 6), child: Text('⚠ Disarankan segera ke dokter/IGD.'.tr, style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600))),
          if (doctors.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text('${'Dokter'.tr} ${meta.s('specialization')} ${'yang tersedia:'.tr}', style: const TextStyle(fontWeight: FontWeight.w600)),
            for (final d in doctors) SizedBox(width: 260, child: DoctorCard(d: d)),
          ],
          if (!mine && meta['disclaimer'] != null) Padding(padding: const EdgeInsets.only(top: 6), child: Text(meta.s('disclaimer'), style: const TextStyle(fontSize: 10, color: Colors.grey))),
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
                padding: const EdgeInsets.all(16),
                itemCount: c.data.value!.length,
                itemBuilder: (_, i) {
                  final a = c.data.value![i];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      leading: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.secondaryLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.article_outlined, color: AppColors.secondaryColor, size: 22),
                      ),
                      title: Text(a.s('judul'), style: const TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text(fmtDate(a['createdAt']), style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                      trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 18),
                      onTap: () => Get.toNamed(AppRoutes.articleDetail, arguments: a.s('slug')),
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
            builder: () => ListView(padding: const EdgeInsets.all(20), children: [
              Text(c.data.value!.s('judul'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(fmtDate(c.data.value!['createdAt']), style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 16),
              Text(c.data.value!.s('konten'), style: const TextStyle(height: 1.6, fontSize: 15)),
            ]),
          )),
    );
  }
}
