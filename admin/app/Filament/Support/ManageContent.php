<?php

namespace App\Filament\Support;

use App\Support\FrontendRevalidator;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

/** One-page list + slide-over form, used by every content screen. */
abstract class ManageContent extends ManageRecords
{
    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->slideOver(),
        ];
    }

    // Drag-and-drop reordering writes with a bulk query (no model events), so refresh the site here
    public function reorderTable(array $order, int|string|null $draggedRecordKey = null): void
    {
        parent::reorderTable($order, $draggedRecordKey);
        FrontendRevalidator::queue();
    }
}
