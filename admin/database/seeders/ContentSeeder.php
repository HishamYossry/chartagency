<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\Client;
use App\Models\Faq;
use App\Models\ProcessStep;
use App\Models\Reel;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Support\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * One-time import of the website's original content (data/content.json, exported from the
 * Next.js dictionaries) and images (data/img). Safe to re-run: it replaces existing content.
 */
class ContentSeeder extends Seeder
{
    private array $en;

    private array $ar;

    /** @var array<string, int> reel image path => reel id */
    private array $reelIds = [];

    public function run(): void
    {
        // Never wipe what the admin has edited by accident (e.g. a re-run of db:seed on the server)
        if (Setting::query()->exists() && ! env('SEED_OVERWRITE')) {
            $this->command?->warn('Content already exists — import skipped. Run with SEED_OVERWRITE=1 to replace it.');

            return;
        }

        $json = json_decode(file_get_contents(__DIR__.'/data/content.json'), true, flags: JSON_THROW_ON_ERROR);
        $this->en = $json['en'];
        $this->ar = $json['ar'];

        foreach ([Reel::class, Client::class, CaseStudy::class, Service::class, ProcessStep::class, Testimonial::class, Faq::class, Setting::class] as $model) {
            $model::query()->delete();
        }

        $this->reels();
        $this->clients();
        $this->cases();
        $this->services();
        $this->processSteps();
        $this->testimonials();
        $this->faqs();
        $this->settings();
    }

    private function reels(): void
    {
        foreach ($this->en['hero']['reels'] as $i => $reel) {
            $this->reelIds[$reel['img']] = Reel::create([
                'image' => $this->copy($reel['img'], 'reels'),
                'alt' => $this->pair("hero.reels.$i.alt"),
                'views' => $reel['views'],
                'caption' => $reel['cap'],
                'in_hero' => true,
                'sort' => $i,
            ])->id;
        }

        // Reels only used inside case studies
        $sort = count($this->reelIds);
        foreach ($this->en['cases']['items'] as $c => $case) {
            foreach ($case['reels'] as $r => $reel) {
                if (isset($this->reelIds[$reel['img']])) {
                    continue;
                }
                $this->reelIds[$reel['img']] = Reel::create([
                    'image' => $this->copy($reel['img'], 'reels'),
                    'alt' => $this->pair("cases.items.$c.reels.$r.alt"),
                    'views' => $reel['views'],
                    'in_hero' => false,
                    'sort' => $sort++,
                ])->id;
            }
        }
    }

    private function clients(): void
    {
        foreach ($this->en['clients'] as $i => $client) {
            Client::create([
                'logo' => $this->copy($client['img'], 'clients'),
                'name' => $this->pair("clients.$i.name"),
                'sort' => $i,
            ]);
        }
    }

    private function cases(): void
    {
        foreach ($this->en['cases']['items'] as $i => $case) {
            $p = "cases.items.$i";
            CaseStudy::create([
                // set here because model events (which normally create it) are muted while seeding
                'slug' => CaseStudy::uniqueSlug($case['name']),
                'name' => $this->pair("$p.name"),
                'specialty' => $this->pair("$p.specialty"),
                'logo' => $this->copy($case['logo'], 'clients'),
                'is_dark' => $case['dark'],
                'spots' => $this->pair("$p.spots"),
                'stats' => collect($case['stats'])->map(fn ($s, $j) => $this->stat($s, "$p.stats.$j"))->all(),
                'reel_ids' => collect($case['reels'])->map(fn ($r) => (string) $this->reelIds[$r['img']])->all(),
                'sort' => $i,
            ]);
        }
    }

    private function services(): void
    {
        $mockups = ['content', 'ad', 'booking', 'maps', 'chat'];
        foreach ($this->en['services']['items'] as $i => $service) {
            $p = "services.items.$i";
            Service::create([
                'chip' => $this->pair("$p.chip"),
                'title' => $this->pair("$p.title"),
                'text' => $this->pair("$p.text"),
                'ticks' => collect($service['ticks'])->keys()->map(fn ($j) => ['text' => $this->pair("$p.ticks.$j")])->all(),
                'mockup' => $mockups[$i % count($mockups)],
                'sort' => $i,
            ]);
        }
    }

    private function processSteps(): void
    {
        foreach ($this->en['process']['steps'] as $i => $step) {
            ProcessStep::create([
                'title' => $this->pair("process.steps.$i.title"),
                'text' => $this->pair("process.steps.$i.text"),
                'sort' => $i,
            ]);
        }
    }

    private function testimonials(): void
    {
        foreach ($this->en['testimonials']['items'] as $i => $item) {
            $p = "testimonials.items.$i";
            Testimonial::create([
                'is_video' => $item['video'],
                'image' => $item['img'] ? $this->copy($item['img'], 'testimonials') : null,
                'quote' => $this->pair("$p.quote"),
                'name' => $this->pair("$p.name"),
                'role' => $this->pair("$p.role"),
                'initials' => $item['initials'] ?: null,
                'sort' => $i,
            ]);
        }
    }

    private function faqs(): void
    {
        foreach ($this->en['faq']['items'] as $i => $item) {
            Faq::create([
                'question' => $this->pair("faq.items.$i.q"),
                'answer' => $this->pair("faq.items.$i.a"),
                'sort' => $i,
            ]);
        }
    }

    private function settings(): void
    {
        $accent = fn (string $path, string $prefix = 'title') => [
            "{$prefix}_before" => $this->pair("$path.before"),
            "{$prefix}_accent" => $this->pair("$path.accent"),
            "{$prefix}_after" => $this->pair("$path.after"),
        ];
        $stats = fn (string $path) => collect(data_get($this->en, $path))->keys()->map(fn ($i) => [
            'value' => data_get($this->en, "$path.$i.to"),
            'suffix' => data_get($this->en, "$path.$i.suffix"),
            'label' => $this->pair("$path.$i.label"),
        ])->all();
        $img = fn (string $file) => $this->copy("/assets/img/$file", 'site');

        Setting::put('general', [
            'whatsapp' => '201014915106',
            'phone_display' => '+20 101 491 5106',
            'email' => 'sales@chartagency.com',
            'address' => $this->pair('contact.address'),
            'socials' => ['instagram' => '', 'facebook' => '', 'tiktok' => '', 'linkedin' => ''],
            'slots_month' => $this->pair('slots.month'),
            'slots_text' => $this->pair('slots.text'),
            'meta_title' => $this->pair('meta.title'),
            'meta_description' => $this->pair('meta.description'),
        ]);

        Setting::put('hero', [
            ...$accent('hero.title'),
            'lead' => $this->pair('hero.lead'),
            'cta' => $this->pair('hero.cta'),
            'trust' => $this->pair('hero.trust'),
            'phone_handle' => $this->en['hero']['phone']['handle'],
            'phone_caption' => $this->en['hero']['phone']['caption'],
            'phone_images' => array_map(fn ($n) => $img("reels/$n.jpg"), ['doctor-man', 'dentist', 'filming-surgery', 'doctor-scrubs']),
            'glass_a' => ['value' => $this->en['hero']['glassA']['to'], 'suffix' => $this->en['hero']['glassA']['suffix'], 'label' => $this->pair('hero.glassA.label')],
            'glass_b' => ['value' => $this->en['hero']['glassB']['to'], 'suffix' => $this->en['hero']['glassB']['suffix'], 'label' => $this->pair('hero.glassB.label')],
        ]);

        $m = $this->en['mission'];
        Setting::put('mission', [
            'chip' => $this->pair('mission.chip'),
            ...$accent('mission.title'),
            'ceo_eyebrow' => $this->pair('mission.ceo.eyebrow'),
            'ceo_title' => $this->pair('mission.ceo.title'),
            'ceo_text' => $this->pair('mission.ceo.text'),
            'signature' => $this->pair('mission.ceo.signature'),
            'role' => $this->pair('mission.ceo.role'),
            'photo' => $img('photos/doctor-glasses.jpg'),
            'photo_alt' => $this->pair('mission.photoAlt'),
            'big' => [
                'value' => $m['big']['to'],
                'decimals' => $m['big']['decimals'],
                'suffix' => $m['big']['suffix'],
                'word' => $this->pair('mission.big.word'),
                'text' => $this->pair('mission.big.text'),
            ],
            'retention' => ['value' => $m['retention']['to'], 'label' => $this->pair('mission.retention.label')],
            'engagement' => ['value' => $m['engagement']['to'], 'label' => $this->pair('mission.engagement.label')],
            'quote_text' => $this->pair('mission.quote.text'),
            'quote_name' => $this->pair('mission.quote.name'),
            'quote_role' => $this->pair('mission.quote.role'),
        ]);

        Setting::put('cases', [
            'chip' => $this->pair('cases.chip'),
            ...$accent('cases.title'),
            ...$accent('cases.midCta.title', 'mid_title'),
            'mid_cta' => $this->pair('cases.midCta.cta'),
            'mid_stats' => $stats('cases.midCta.stats'),
            'mid_quote' => $this->pair('cases.midCta.quote'),
            'mid_quote_by' => $this->pair('cases.midCta.quoteBy'),
        ]);

        Setting::put('why', [
            'chip' => $this->pair('why.chip'),
            ...$accent('why.title'),
            'platform_title' => $this->pair('why.platform.title'),
            'platform_text' => $this->pair('why.platform.text'),
            'squad_image' => $img('photos/dental-xray.jpg'),
            'squad_tag' => $this->pair('why.squad.tag'),
            'squad_alt' => $this->pair('why.squad.alt'),
            'squad_title' => $this->pair('why.squad.title'),
            'squad_text' => $this->pair('why.squad.text'),
            'photo_image' => $img('photos/doctor-woman.jpg'),
            'photo_alt' => $this->pair('why.photo.alt'),
            'photo_title' => $this->pair('why.photo.title'),
            'photo_text' => $this->pair('why.photo.text'),
            'photo_cta' => $this->pair('why.photo.cta'),
            'growth_title' => $this->pair('why.growth.title'),
            'growth_text' => $this->pair('why.growth.text'),
            'growth_pills' => collect($this->en['why']['growth']['pills'])->keys()->map(fn ($i) => ['text' => $this->pair("why.growth.pills.$i")])->all(),
            'analytics_title' => $this->pair('why.analytics.title'),
            'analytics_text' => $this->pair('why.analytics.text'),
        ]);

        Setting::put('services', [
            'chip' => $this->pair('services.chip'),
            'title' => $this->pair('services.title'),
            'cta' => $this->pair('services.cta'),
        ]);

        Setting::put('process', [
            'chip' => $this->pair('process.chip'),
            'title_before' => $this->pair('process.title.before'),
            'title_accent' => $this->pair('process.title.accent'),
            'stats' => $stats('process.stats'),
            'call_avatar' => $img('photos/doctor-coat.jpg'),
            'content_day_image' => $img('reels/filming-surgery.jpg'),
        ]);

        Setting::put('testimonials', ['chip' => $this->pair('testimonials.chip'), ...$accent('testimonials.title')]);

        Setting::put('faq', [
            'chip' => $this->pair('faq.chip'),
            ...$accent('faq.title'),
            'text' => $this->pair('faq.text'),
            'cta' => $this->pair('faq.cta'),
        ]);

        Setting::put('contact', [
            ...$accent('contact.title'),
            'text' => $this->pair('contact.text'),
            'cta_images' => array_map(fn ($n) => $img("reels/$n.jpg"), ['doctor-smiling', 'surgery', 'facial-peel', 'eye-exam']),
        ]);

        Setting::put('footer', [
            'tagline' => $this->pair('footer.tagline'),
            'word' => $this->en['footer']['word'],
            'rights' => $this->pair('footer.rights'),
        ]);
    }

    // --- helpers ----------------------------------------------------------

    /**
     * The sign (+/−) is shared by both languages in the admin. The original copy had it only in
     * Arabic for one stat ("+1.2 مليون" vs "1.2 Million+"), so move it to the shared prefix.
     */
    private function stat(array $s, string $path): array
    {
        $arPrefix = (string) data_get($this->ar, "$path.prefix", '');
        $prefix = $s['prefix'] !== '' ? $s['prefix'] : $arPrefix;
        $word = $this->pair("$path.word");
        if ($prefix !== '' && $s['prefix'] === '') {
            $word['en'] = rtrim($word['en'], '+');
        }

        return [
            'prefix' => $prefix,
            'value' => $s['to'],
            'decimals' => $s['decimals'],
            'suffix' => $s['suffix'],
            'word' => $word,
            'label' => $this->pair("$path.label"),
            'sub' => $this->pair("$path.sub"),
        ];
    }

    /** {"en": ..., "ar": ...} for the same path in both dictionaries */
    private function pair(string $path): array
    {
        return ['en' => (string) data_get($this->en, $path, ''), 'ar' => (string) data_get($this->ar, $path, '')];
    }

    /** Copies "/assets/img/x/y.jpg" from data/img into the uploads disk; returns the stored path. */
    private function copy(string $publicPath, string $directory): string
    {
        $relative = preg_replace('#^/?assets/img/#', '', $publicPath);
        $source = __DIR__.'/data/img/'.$relative;
        $target = $directory.'/'.basename($relative);

        if (! Storage::disk(Media::DISK)->exists($target)) {
            Storage::disk(Media::DISK)->put($target, file_get_contents($source));
        }

        return $target;
    }
}
