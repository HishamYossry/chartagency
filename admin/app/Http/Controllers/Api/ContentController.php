<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Models\Client;
use App\Models\Concerns\Translatable;
use App\Models\Faq;
use App\Models\ProcessStep;
use App\Models\Reel;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Support\Media;
use App\Support\Present;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Everything the website shows, for one language, shaped like the site's own dictionary
 * (src/i18n/dictionaries/en.ts). Values left empty in the admin come back as null, and the
 * site then keeps its bundled text instead of showing a blank.
 */
class ContentController extends Controller
{
    private string $locale = 'en';

    /** @var array<string, array<string, mixed>> */
    private array $s = [];

    public function __invoke(Request $request): JsonResponse
    {
        $this->locale = $request->query('locale') === 'ar' ? 'ar' : 'en';
        $this->s = Setting::allSections();

        $data = [
            'meta' => [
                'title' => $this->t('general.meta_title'),
                'description' => $this->t('general.meta_description'),
            ],
            'slots' => [
                'month' => $this->t('general.slots_month'),
                'text' => $this->t('general.slots_text'),
            ],
            'hero' => $this->hero(),
            'clients' => Client::query()->visible()->get()->map(fn (Client $c) => [
                'img' => Media::url($c->logo),
                'name' => $c->tr('name', $this->locale),
            ])->all(),
            'mission' => $this->mission(),
            'cases' => $this->cases(),
            'why' => $this->why(),
            'services' => $this->services(),
            'process' => $this->process(),
            'testimonials' => $this->testimonials(),
            'faq' => [
                'chip' => $this->t('faq.chip'),
                'title' => $this->accent('faq'),
                'text' => $this->t('faq.text'),
                'cta' => $this->t('faq.cta'),
                'items' => Faq::query()->visible()->get()->map(fn (Faq $f) => [
                    'q' => $f->tr('question', $this->locale),
                    'a' => $f->tr('answer', $this->locale),
                ])->all(),
            ],
            'contact' => [
                'title' => $this->accent('contact'),
                'text' => $this->t('contact.text'),
                'address' => $this->t('general.address'),
            ],
            'footer' => [
                'tagline' => $this->t('footer.tagline'),
                'word' => $this->v('footer.word'),
                'rights' => $this->t('footer.rights'),
            ],
            'contactInfo' => $this->contactInfo(),
            'images' => [
                'phone' => $this->images('hero.phone_images'),
                'missionPhoto' => $this->image('mission.photo'),
                'whySquad' => $this->image('why.squad_image'),
                'whyPhoto' => $this->image('why.photo_image'),
                'ctaFan' => $this->images('contact.cta_images'),
                'callAvatar' => $this->image('process.call_avatar'),
                'contentDay' => $this->image('process.content_day_image'),
            ],
        ];

        return response()->json($this->prune($data));
    }

    private function hero(): array
    {
        return [
            'title' => $this->accent('hero'),
            'lead' => $this->t('hero.lead'),
            'cta' => $this->t('hero.cta'),
            'reels' => Reel::query()->visible()->where('in_hero', true)->get()->map(fn (Reel $r) => Present::reel($r, $this->locale))->all(),
            'phone' => [
                'handle' => $this->v('hero.phone_handle'),
                'caption' => $this->v('hero.phone_caption'),
            ],
            'glassA' => $this->stat('hero.glass_a'),
            'glassB' => $this->stat('hero.glass_b'),
            'trust' => $this->t('hero.trust'),
        ];
    }

    private function mission(): array
    {
        return [
            'chip' => $this->t('mission.chip'),
            'title' => $this->accent('mission'),
            'ceo' => [
                'eyebrow' => $this->t('mission.ceo_eyebrow'),
                'title' => $this->t('mission.ceo_title'),
                'text' => $this->t('mission.ceo_text'),
                'signature' => $this->t('mission.signature'),
                'role' => $this->t('mission.role'),
            ],
            'photoAlt' => $this->t('mission.photo_alt'),
            'big' => [
                'to' => $this->num('mission.big.value'),
                'decimals' => (int) ($this->v('mission.big.decimals') ?? 0),
                'suffix' => $this->v('mission.big.suffix') ?? '',
                'word' => $this->t('mission.big.word') ?? '',
                'text' => $this->t('mission.big.text'),
            ],
            'retention' => ['to' => $this->num('mission.retention.value'), 'label' => $this->t('mission.retention.label')],
            'engagement' => ['to' => $this->num('mission.engagement.value'), 'label' => $this->t('mission.engagement.label')],
            'quote' => [
                'text' => $this->t('mission.quote_text'),
                'name' => $this->t('mission.quote_name'),
                'role' => $this->t('mission.quote_role'),
            ],
        ];
    }

    private function cases(): array
    {
        $items = CaseStudy::query()->visible()->get()->map(fn (CaseStudy $c) => Present::caseCard($c, $this->locale))->all();

        return [
            'chip' => $this->t('cases.chip'),
            'title' => $this->accent('cases'),
            'items' => $items,
            'midCta' => [
                'title' => $this->accent('cases', 'mid_title'),
                'cta' => $this->t('cases.mid_cta'),
                'stats' => $this->stats('cases.mid_stats'),
                'quote' => $this->t('cases.mid_quote'),
                'quoteBy' => $this->t('cases.mid_quote_by'),
            ],
        ];
    }

    private function why(): array
    {
        $pills = collect(data_get($this->s, 'why.growth_pills', []))
            ->map(fn ($p) => Translatable::pick($p['text'] ?? null, $this->locale))->filter()->values()->all();

        return [
            'chip' => $this->t('why.chip'),
            'title' => $this->accent('why'),
            'platform' => ['title' => $this->t('why.platform_title'), 'text' => $this->t('why.platform_text')],
            'squad' => [
                'title' => $this->t('why.squad_title'),
                'text' => $this->t('why.squad_text'),
                'tag' => $this->t('why.squad_tag'),
                'alt' => $this->t('why.squad_alt'),
            ],
            'photo' => [
                'title' => $this->t('why.photo_title'),
                'text' => $this->t('why.photo_text'),
                'cta' => $this->t('why.photo_cta'),
                'alt' => $this->t('why.photo_alt'),
            ],
            'growth' => ['title' => $this->t('why.growth_title'), 'text' => $this->t('why.growth_text'), 'pills' => $pills ?: null],
            'analytics' => ['title' => $this->t('why.analytics_title'), 'text' => $this->t('why.analytics_text')],
        ];
    }

    private function services(): array
    {
        return [
            'chip' => $this->t('services.chip'),
            'title' => $this->t('services.title'),
            'cta' => $this->t('services.cta'),
            'items' => Service::query()->visible()->get()->map(fn (Service $s) => [
                'chip' => $s->tr('chip', $this->locale),
                'title' => $s->tr('title', $this->locale),
                'text' => $s->tr('text', $this->locale),
                'ticks' => collect($s->ticks ?? [])->map(fn ($t) => Translatable::pick($t['text'] ?? $t, $this->locale))->filter()->values()->all(),
                'mockup' => $s->mockup,
            ])->all(),
        ];
    }

    private function process(): array
    {
        return [
            'chip' => $this->t('process.chip'),
            'title' => ['before' => $this->t('process.title_before'), 'accent' => $this->t('process.title_accent'), 'after' => ''],
            'steps' => ProcessStep::query()->visible()->get()->map(fn (ProcessStep $p) => [
                'title' => $p->tr('title', $this->locale),
                'text' => $p->tr('text', $this->locale),
            ])->all(),
            'stats' => $this->stats('process.stats'),
        ];
    }

    private function testimonials(): array
    {
        return [
            'chip' => $this->t('testimonials.chip'),
            'title' => $this->accent('testimonials'),
            'items' => Testimonial::query()->visible()->get()->map(fn (Testimonial $t) => [
                'video' => $t->is_video,
                'img' => Media::url($t->image),
                'videoUrl' => Media::url($t->video),
                'quote' => $t->tr('quote', $this->locale),
                'name' => $t->tr('name', $this->locale),
                'role' => $t->tr('role', $this->locale),
                'initials' => (string) $t->initials,
            ])->all(),
        ];
    }

    private function contactInfo(): array
    {
        $whatsapp = preg_replace('/\D+/', '', (string) $this->v('general.whatsapp')) ?: null;
        $phone = $this->v('general.phone_display');

        return [
            'whatsapp' => $whatsapp,
            'phoneDisplay' => $phone,
            'phoneHref' => $phone ? 'tel:'.preg_replace('/[^\d+]+/', '', $phone) : null,
            'email' => $this->v('general.email'),
            'socials' => collect(['instagram', 'facebook', 'tiktok', 'linkedin'])
                ->mapWithKeys(fn ($k) => [$k => (string) ($this->v("general.socials.$k") ?? '')])->all(),
        ];
    }

    // --- helpers ---------------------------------------------------------

    /** Raw (non-translated) setting value, or null when not set. */
    private function v(string $path): mixed
    {
        $value = data_get($this->s, $path);

        return blank($value) ? null : $value;
    }

    /** Translated setting value, or null when empty in both languages. */
    private function t(string $path): ?string
    {
        $value = Translatable::pick(data_get($this->s, $path), $this->locale);

        return $value === '' ? null : $value;
    }

    private function num(string $path): ?float
    {
        $value = $this->v($path);

        return is_numeric($value) ? (float) $value : null;
    }

    /** Heading with a highlighted word: {section}.{prefix}_before/_accent/_after */
    private function accent(string $section, string $prefix = 'title'): array
    {
        return [
            'before' => $this->t("$section.{$prefix}_before"),
            'accent' => $this->t("$section.{$prefix}_accent"),
            // Often empty in one language only (word order differs), so no English fallback
            'after' => Translatable::pick(data_get($this->s, "$section.{$prefix}_after"), $this->locale, fallback: false),
        ];
    }

    private function stat(string $path): array
    {
        return [
            'to' => $this->num("$path.value"),
            'suffix' => $this->v("$path.suffix") ?? '',
            'word' => '',
            'label' => $this->t("$path.label"),
        ];
    }

    private function stats(string $path): ?array
    {
        $rows = collect(data_get($this->s, $path, []))->map(fn (array $s) => [
            'to' => (float) ($s['value'] ?? 0),
            'suffix' => (string) ($s['suffix'] ?? ''),
            'word' => '',
            'label' => Translatable::pick($s['label'] ?? null, $this->locale),
        ])->values()->all();

        return $rows ?: null;
    }

    private function image(string $path): ?string
    {
        return Media::url($this->v($path)) ?: null;
    }

    private function images(string $path): ?array
    {
        $urls = collect((array) data_get($this->s, $path, []))->map(fn ($p) => Media::url($p))->filter()->values()->all();

        return $urls ?: null;
    }

    /** Drops nulls so the site keeps its bundled fallback for anything not filled in. */
    private function prune(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value) && ! array_is_list($value)) {
                $data[$key] = $this->prune($value);
            } elseif ($value === null) {
                unset($data[$key]);
            }
        }

        return $data;
    }
}
