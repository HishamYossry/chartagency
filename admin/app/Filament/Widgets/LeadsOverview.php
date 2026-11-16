<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Leads\LeadResource;
use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Reel;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LeadsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = -1;

    protected function getStats(): array
    {
        $new = Lead::query()->where('status', 'new')->count();
        $month = Lead::query()->where('created_at', '>=', now()->startOfMonth())->count();
        $won = Lead::query()->where('status', 'won')->where('created_at', '>=', now()->startOfMonth())->count();

        return [
            Stat::make('New leads', $new)
                ->description('Waiting for a call back')
                ->color($new > 0 ? 'warning' : 'success')
                ->url(LeadResource::getUrl()),
            Stat::make('Leads this month', $month)->description($won.' won'),
            Stat::make('On the website', Reel::query()->where('is_active', true)->count().' reels')
                ->description(CaseStudy::query()->where('is_active', true)->count().' case studies'),
        ];
    }
}
