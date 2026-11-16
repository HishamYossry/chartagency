<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\FrontendRevalidator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(ContentSeeder::class);
        $this->call(CaseStudyDetailsSeeder::class); // only fills empty fields

        // Local development login only — on the server create users with: php artisan make:filament-user
        if (app()->isLocal()) {
            User::query()->updateOrCreate(
                ['email' => 'admin@chartagency.test'],
                ['name' => 'Admin', 'password' => 'password', 'role' => 'admin'],
            );
        }

        // Model events are muted while seeding, so refresh the website once at the end
        FrontendRevalidator::send();
    }
}
