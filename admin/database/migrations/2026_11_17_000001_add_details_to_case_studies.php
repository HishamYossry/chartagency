<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Fields for the case study details page (/en/case-studies/{slug}/). Translatable columns are {"en", "ar"}.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('id');
            $table->json('headline')->nullable()->after('specialty');   // big title on the details page
            $table->json('summary')->nullable()->after('headline');     // intro paragraph
            $table->string('cover')->nullable()->after('logo');         // wide hero image
            $table->json('location')->nullable();
            $table->json('duration')->nullable();                       // e.g. "90 days"
            $table->json('services_used')->nullable();                  // [{en, ar}] tags
            $table->json('challenge')->nullable();
            $table->json('solution')->nullable();
            $table->json('results')->nullable();
            $table->json('quote')->nullable();
            $table->json('quote_by')->nullable();
            $table->json('meta_title')->nullable();
            $table->json('meta_description')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn([
                'slug', 'headline', 'summary', 'cover', 'location', 'duration', 'services_used',
                'challenge', 'solution', 'results', 'quote', 'quote_by', 'meta_title', 'meta_description',
            ]);
        });
    }
};
