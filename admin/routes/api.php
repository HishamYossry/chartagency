<?php

use App\Http\Controllers\Api\CaseStudyController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\LeadController;
use Illuminate\Support\Facades\Route;

// Read by the Next.js site (server-side) to render every page
Route::get('/v1/content', ContentController::class);
Route::get('/v1/case-studies/{slug}', CaseStudyController::class)->where('slug', '[A-Za-z0-9-]+');

// "Book a strategy call" form — limited to stop spam floods
Route::post('/v1/leads', LeadController::class)->middleware('throttle:10,1');
