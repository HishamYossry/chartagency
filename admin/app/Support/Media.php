<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/** Uploaded files live on the "uploads" disk (public/uploads) — no storage symlink needed on Hostinger. */
class Media
{
    public const DISK = 'uploads';

    public static function url(?string $path): string
    {
        if (blank($path)) {
            return '';
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk(self::DISK)->url($path);
    }
}
