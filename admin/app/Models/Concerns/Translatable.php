<?php

namespace App\Models\Concerns;

/**
 * Columns listed in $translatable hold {"en": "...", "ar": "..."}.
 * An empty Arabic value falls back to English so the site never shows a blank.
 */
trait Translatable
{
    public function initializeTranslatable(): void
    {
        foreach ($this->translatable ?? [] as $attribute) {
            $this->casts[$attribute] = 'array';
        }
    }

    public function tr(string $attribute, string $locale): string
    {
        return self::pick($this->{$attribute}, $locale);
    }

    /** $fallback = false for optional parts that may be intentionally empty in one language. */
    public static function pick(mixed $value, string $locale, bool $fallback = true): string
    {
        if (! is_array($value)) {
            return (string) ($value ?? '');
        }

        if (! $fallback || filled($value[$locale] ?? null)) {
            return (string) ($value[$locale] ?? '');
        }

        return (string) ($value['en'] ?? '');
    }
}
