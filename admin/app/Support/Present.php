<?php

namespace App\Support;

use App\Models\CaseStudy;
use App\Models\Concerns\Translatable;
use App\Models\Reel;

/** Shapes models into the JSON the website expects, for one language. */
class Present
{
    public static function reel(Reel $r, string $locale): array
    {
        return [
            'img' => Media::url($r->image),
            'video' => Media::url($r->video),
            'alt' => $r->tr('alt', $locale),
            'views' => (string) $r->views,
            'cap' => (string) $r->caption,
        ];
    }

    public static function caseStats(CaseStudy $c, string $locale, ?int $limit = null): array
    {
        return collect($c->stats ?? [])->take($limit ?? PHP_INT_MAX)->map(fn (array $s) => [
            'prefix' => (string) ($s['prefix'] ?? ''),
            'to' => (float) ($s['value'] ?? 0),
            'decimals' => (int) ($s['decimals'] ?? 0),
            'suffix' => (string) ($s['suffix'] ?? ''),
            'word' => Translatable::pick($s['word'] ?? null, $locale),
            'label' => Translatable::pick($s['label'] ?? null, $locale),
            'sub' => Translatable::pick($s['sub'] ?? null, $locale, fallback: false),
        ])->values()->all();
    }

    public static function caseReels(CaseStudy $c, string $locale, ?int $limit = null): array
    {
        return $c->orderedReels()->take($limit ?? PHP_INT_MAX)->map(fn (Reel $r) => self::reel($r, $locale))->values()->all();
    }

    /** The home page card. */
    public static function caseCard(CaseStudy $c, string $locale): array
    {
        return [
            'slug' => $c->slug,
            'dark' => $c->is_dark,
            'logo' => Media::url($c->logo),
            'name' => $c->tr('name', $locale),
            'specialty' => $c->tr('specialty', $locale),
            'spots' => $c->tr('spots', $locale),
            'stats' => self::caseStats($c, $locale, CaseStudy::CARD_ITEMS),
            'reels' => self::caseReels($c, $locale, CaseStudy::CARD_ITEMS),
        ];
    }

    /** The full details page. */
    public static function caseDetail(CaseStudy $c, string $locale): array
    {
        $headline = $c->tr('headline', $locale);
        $summary = $c->tr('summary', $locale);

        return [
            'slug' => $c->slug,
            'dark' => $c->is_dark,
            'logo' => Media::url($c->logo),
            'cover' => Media::url($c->cover),
            'name' => $c->tr('name', $locale),
            'specialty' => $c->tr('specialty', $locale),
            'headline' => $headline,
            'summary' => $summary,
            'location' => $c->tr('location', $locale),
            'duration' => $c->tr('duration', $locale),
            'services' => collect($c->services_used ?? [])->map(fn ($s) => Translatable::pick($s['text'] ?? null, $locale))->filter()->values()->all(),
            'stats' => self::caseStats($c, $locale),
            'reels' => self::caseReels($c, $locale),
            'challenge' => $c->tr('challenge', $locale),
            'solution' => $c->tr('solution', $locale),
            'results' => $c->tr('results', $locale),
            'quote' => $c->tr('quote', $locale),
            'quoteBy' => $c->tr('quote_by', $locale),
            'meta' => [
                'title' => $c->tr('meta_title', $locale) ?: ($headline ?: $c->tr('name', $locale)),
                'description' => $c->tr('meta_description', $locale) ?: $summary,
                'image' => Media::url($c->cover) ?: Media::url($c->orderedReels()->first()?->image),
            ],
        ];
    }
}
