<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use App\Models\Concerns\RevalidatesFrontend;
use App\Models\Concerns\Translatable;
use Illuminate\Database\Eloquent\Model;

/** Service card with a phone mockup. */
class Service extends Model
{
    use Ordered, RevalidatesFrontend, Translatable;

    protected $guarded = ['id'];

    protected array $translatable = ['chip', 'title', 'text'];

    protected $casts = ['ticks' => 'array'];
}
