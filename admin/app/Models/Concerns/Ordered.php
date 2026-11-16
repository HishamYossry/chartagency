<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/** Drag-and-drop order (`sort`) plus the "Visible on website" switch (`is_active`). */
trait Ordered
{
    // New items go to the end of the list unless a position is given
    public static function bootOrdered(): void
    {
        static::creating(function ($model) {
            $model->sort ??= (int) static::query()->max('sort') + 1;
        });
    }

    public function initializeOrdered(): void
    {
        $this->casts['is_active'] = 'boolean';
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort')->orderBy('id');
    }
}
