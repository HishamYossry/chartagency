<?php

namespace App\Models;

use App\Models\Concerns\RevalidatesFrontend;
use Illuminate\Database\Eloquent\Model;

/** One row per page section (general, hero, mission...), edited on the "Site content" page. */
class Setting extends Model
{
    use RevalidatesFrontend;

    protected $guarded = ['id'];

    protected $casts = ['value' => 'array'];

    /** @return array<string, mixed> */
    public static function section(string $key): array
    {
        return static::query()->where('key', $key)->value('value') ?? [];
    }

    /** @return array<string, array<string, mixed>> all sections keyed by name */
    public static function allSections(): array
    {
        return static::query()->pluck('value', 'key')->map(fn ($v) => is_array($v) ? $v : json_decode((string) $v, true))->all();
    }

    public static function put(string $key, array $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
