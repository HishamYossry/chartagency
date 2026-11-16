<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Translatable columns are JSON objects: {"en": "...", "ar": "..."}.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('admin')->after('email'); // admin | editor
        });

        // Single-value page sections (hero, mission, contact info...) keyed by section name
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value');
            $table->timestamps();
        });

        Schema::create('reels', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->string('video')->nullable();
            $table->json('alt');
            $table->string('views')->default('');
            $table->string('caption')->nullable(); // Arabic hook text shown on the reel
            $table->boolean('in_hero')->default(true);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('logo');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('specialty');
            $table->string('logo')->nullable();
            $table->boolean('is_dark')->default(false);
            $table->json('spots')->nullable();
            $table->json('stats');      // [{prefix, value, decimals, suffix, word{}, label{}, sub{}}]
            $table->json('reel_ids');   // ordered reel ids
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->json('chip');
            $table->json('title');
            $table->json('text');
            $table->json('ticks');      // [{en, ar}]
            $table->string('mockup')->default('content'); // content | ad | booking | maps | chat
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('process_steps', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('text');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_video')->default(false);
            $table->string('image')->nullable();
            $table->string('video')->nullable();
            $table->json('quote');
            $table->json('name')->nullable();
            $table->json('role');
            $table->string('initials', 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->json('question');
            $table->json('answer');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 40);
            $table->string('practice')->nullable();
            $table->string('specialty')->nullable();
            $table->string('locale', 5)->default('en');
            $table->string('status')->default('new'); // new | contacted | won | lost
            $table->text('notes')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('process_steps');
        Schema::dropIfExists('services');
        Schema::dropIfExists('case_studies');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('reels');
        Schema::dropIfExists('settings');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('role'));
    }
};
