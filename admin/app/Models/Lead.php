<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Enquiry sent from the website's "Book a strategy call" form. */
class Lead extends Model
{
    public const STATUSES = [
        'new' => 'New',
        'contacted' => 'Contacted',
        'won' => 'Won',
        'lost' => 'Lost',
    ];

    protected $guarded = ['id'];
}
