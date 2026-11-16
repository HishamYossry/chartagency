<?php

namespace App\Models\Concerns;

use App\Support\FrontendRevalidator;

/** Any save or delete refreshes the public website. */
trait RevalidatesFrontend
{
    public static function bootRevalidatesFrontend(): void
    {
        static::saved(fn () => FrontendRevalidator::queue());
        static::deleted(fn () => FrontendRevalidator::queue());
    }
}
