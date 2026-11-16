<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use App\Models\Concerns\RevalidatesFrontend;
use App\Models\Concerns\Translatable;
use Illuminate\Database\Eloquent\Model;

/** Video reel tile used in the hero slider and case studies. */
class Reel extends Model
{
    use Ordered, RevalidatesFrontend, Translatable;

    protected $guarded = ['id'];

    protected array $translatable = ['alt'];

    protected $casts = ['in_hero' => 'boolean'];
}
