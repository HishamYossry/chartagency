<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use App\Models\Concerns\RevalidatesFrontend;
use App\Models\Concerns\Translatable;
use Illuminate\Database\Eloquent\Model;

/** Text or video client review. */
class Testimonial extends Model
{
    use Ordered, RevalidatesFrontend, Translatable;

    protected $guarded = ['id'];

    protected array $translatable = ['quote', 'name', 'role'];

    protected $casts = ['is_video' => 'boolean'];
}
