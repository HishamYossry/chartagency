<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Tells the Next.js site (FRONTEND_URL) to drop its cached pages.
 * Many saves in one request (e.g. reordering) send a single call, after the response is sent.
 */
class FrontendRevalidator
{
    private static bool $queued = false;

    public static function queue(): void
    {
        if (self::$queued || app()->runningUnitTests()) {
            return;
        }

        self::$queued = true;
        app()->terminating(function () {
            self::$queued = false;
            self::send();
        });
    }

    public static function send(): bool
    {
        $url = rtrim((string) config('services.frontend.url'), '/');
        $secret = (string) config('services.frontend.revalidate_secret');

        if ($url === '' || $secret === '') {
            return false;
        }

        try {
            return Http::timeout(5)
                ->withHeaders(['x-revalidate-secret' => $secret])
                ->post($url.'/api/revalidate/') // trailing slash: the site uses trailingSlash, avoids a redirect
                ->successful();
        } catch (Throwable $e) {
            // The site also refreshes itself hourly, so a failed call is not fatal
            Log::warning('Frontend revalidation failed: '.$e->getMessage());

            return false;
        }
    }
}
