<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use App\Models\Concerns\RevalidatesFrontend;
use App\Models\Concerns\Translatable;
use Illuminate\Database\Eloquent\Model;

/** Step in the "How Chart works" timeline. */
class ProcessStep extends Model
{
    use Ordered, RevalidatesFrontend, Translatable;

    protected $guarded = ['id'];

    protected array $translatable = ['title', 'text'];
}
