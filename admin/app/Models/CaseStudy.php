<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use App\Models\Concerns\RevalidatesFrontend;
use App\Models\Concerns\Translatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/** Client success story: a card on the home page and its own details page. */
class CaseStudy extends Model
{
    use Ordered, RevalidatesFrontend, Translatable;

    /** How many stats / reels the home page card shows; the details page shows all. */
    public const CARD_ITEMS = 3;

    protected $guarded = ['id'];

    protected array $translatable = [
        'name', 'specialty', 'spots', 'headline', 'summary', 'location', 'duration',
        'challenge', 'solution', 'results', 'quote', 'quote_by', 'meta_title', 'meta_description',
    ];

    protected $casts = ['is_dark' => 'boolean', 'stats' => 'array', 'reel_ids' => 'array', 'services_used' => 'array'];

    protected static function booted(): void
    {
        // The URL slug comes from the English name unless the admin typed one
        static::saving(function (CaseStudy $case) {
            $case->slug = self::uniqueSlug($case->slug ?: ($case->name['en'] ?? ''), $case->id);
        });
    }

    public static function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source) ?: 'case-study';
        $slug = $base;

        for ($i = 2; static::query()->where('slug', $slug)->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))->exists(); $i++) {
            $slug = "$base-$i";
        }

        return $slug;
    }

    /** The selected reels, in the order the admin picked them. */
    public function orderedReels(): Collection
    {
        $ids = array_map('intval', $this->reel_ids ?? []);

        return Reel::query()->whereIn('id', $ids)->get()->sortBy(fn (Reel $reel) => array_search($reel->id, $ids))->values();
    }
}
