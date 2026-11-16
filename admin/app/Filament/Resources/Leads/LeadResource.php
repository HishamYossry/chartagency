<?php

namespace App\Filament\Resources\Leads;

use App\Filament\Resources\Leads\Pages\ManageLeads;
use App\Models\Lead;
use App\Filament\Support\Fields;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $modelLabel = 'lead';

    protected static ?string $pluralModelLabel = 'Leads';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInboxArrowDown;

    protected static string|UnitEnum|null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 1;

    public static function canCreate(): bool
    {
        return false; // leads only come from the website form
    }

    public static function getNavigationBadge(): ?string
    {
        $new = Lead::query()->where('status', 'new')->count();

        return $new > 0 ? (string) $new : null;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(1)->components([
            Grid::make(2)->schema([
                TextInput::make('name')->required(),
                TextInput::make('phone')->required(),
                TextInput::make('practice'),
                TextInput::make('specialty'),
            ]),
            Select::make('status')->options(Lead::STATUSES)->required(),
            Textarea::make('notes')->rows(4)->placeholder('Call notes, next steps...'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')->label('Received')->since()->sortable()
                    ->description(fn (Lead $record) => $record->created_at?->format('d M Y, H:i')),
                TextColumn::make('name')->searchable()->weight('bold'),
                TextColumn::make('phone')->searchable()
                    ->url(fn (Lead $record) => 'https://wa.me/'.preg_replace('/\D+/', '', $record->phone), shouldOpenInNewTab: true),
                TextColumn::make('practice')->searchable()->toggleable(),
                TextColumn::make('specialty')->toggleable(),
                TextColumn::make('locale')->label('Lang')->badge(),
                SelectColumn::make('status')->options(Lead::STATUSES)->selectablePlaceholder(false),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options(Lead::STATUSES),
            ])
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
        return ['index' => ManageLeads::route('/')];
    }
}
