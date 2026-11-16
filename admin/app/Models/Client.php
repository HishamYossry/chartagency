<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use App\Models\Concerns\RevalidatesFrontend;
use App\Models\Concerns\Translatable;
use Illuminate\Database\Eloquent\Model;

/** Logo in the "trusted by" strip. */
class Client extends Model
{
    use Ordered, RevalidatesFrontend, Translatable;

    protected $guarded = ['id'];

    protected array $translatable = ['name'];
}
