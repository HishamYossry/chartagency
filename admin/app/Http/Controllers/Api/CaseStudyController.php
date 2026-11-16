<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Support\Media;
use App\Support\Present;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** One case study for its details page: /en/case-studies/{slug}/ on the website. */
class CaseStudyController extends Controller
{
    public function __invoke(Request $request, string $slug): JsonResponse
    {
        $locale = $request->query('locale') === 'ar' ? 'ar' : 'en';

        $visible = CaseStudy::query()->visible()->get();
        $index = $visible->search(fn (CaseStudy $c) => $c->slug === $slug);
        abort_if($index === false, 404);

        $case = $visible[$index];
        // "Next case study" at the bottom of the page, wrapping around to the first
        $next = $visible->count() > 1 ? $visible[($index + 1) % $visible->count()] : null;

        return response()->json([
            ...Present::caseDetail($case, $locale),
            'next' => $next ? [
                'slug' => $next->slug,
                'name' => $next->tr('name', $locale),
                'specialty' => $next->tr('specialty', $locale),
                'headline' => $next->tr('headline', $locale),
                'logo' => Media::url($next->logo),
            ] : null,
        ]);
    }
}
