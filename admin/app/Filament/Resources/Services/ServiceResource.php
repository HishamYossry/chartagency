<?php

namespace App\Filament\Resources\Services;

use App\Filament\Resources\Services\Pages\ManageServices;
use App\Models\Service;
use App\Filament\Support\Fields;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $modelLabel = 'service';

    protected static ?string $pluralModelLabel = 'Services';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(1)->components([
            Fields::tr('chip', 'Small tag above the title'),
            Fields::tr('title', 'Title', required: true),
            Fields::tr('text', 'Description', textarea: true),
            Repeater::make('ticks')->label('Bullet points')->schema([Fields::tr('text', 'Bullet')])
                ->reorderable()->collapsible()->defaultItems(3)
                ->itemLabel(fn (array $state) => $state['text']['en'] ?? null),
            Select::make('mockup')->label('Phone mockup shown on the card')->required()->default('content')->options([
                'content' => 'Reels app',
                'ad' => 'Sponsored ad',
                'booking' => 'Booking screen',
                'maps' => 'Google Maps listing',
                'chat' => 'WhatsApp chat',
            ]),
            Fields::visible(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Fields::trColumn('title', 'Service'),
                TextColumn::make('mockup')->label('Mockup')->badge(),
                Fields::visibleColumn(),
            ])
            ->reorderable('sort')
            ->defaultSort('sort')
            ->recordActions([
                EditAction::make()->slideOver(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageServices::route('/')];
    }
}
