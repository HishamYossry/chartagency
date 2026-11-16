<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Notifications\NewLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Throwable;

class LeadController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Honeypot: bots fill every field. Pretend success so they don't retry.
        if (filled($request->input('website'))) {
            return response()->json(['ok' => true], 201);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'phone' => ['required', 'string', 'min:7', 'max:40'],
            'practice' => ['nullable', 'string', 'max:160'],
            'specialty' => ['nullable', 'string', 'max:120'],
            'locale' => ['nullable', 'in:en,ar'],
        ]);

        $lead = Lead::create([
            ...$data,
            'locale' => $data['locale'] ?? 'en',
            'ip' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        $to = config('services.leads.notify_email');
        if ($to) {
            try {
                Notification::route('mail', $to)->notify(new NewLead($lead));
            } catch (Throwable $e) {
                // The lead is saved either way; a mail problem must not lose it
                Log::warning('Lead email failed: '.$e->getMessage());
            }
        }

        return response()->json(['ok' => true], 201);
    }
}
