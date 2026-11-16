<?php

namespace App\Filament\Resources\Reels;

use App\Filament\Resources\Reels\Pages\ManageReels;
use App\Models\Reel;
use App\Filament\Support\Fields;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use UnitEnum;

class ReelResource extends Resource
{
    protected static ?string $model = Reel::class;

    protected static ?string $modelLabel = 'reel';

    protected static ?string $pluralModelLabel = 'Reels';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFilm;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(1)->components([
            Fields::image('image', 'Cover image (vertical 9:16)', 'reels')->required(),
            Fields::video('video', 'Reel video', 'reels'),
            TextInput::make('views')->label('Views label')->placeholder('248K')->maxLength(20),
            TextInput::make('caption')->label('Caption on the reel (Arabic hook)')->extraInputAttributes(['dir' => 'rtl', 'lang' => 'ar'])->maxLength(120),
            Fields::tr('alt', 'Image description (for screen readers & SEO)'),
            Toggle::make('in_hero')->label('Show in the hero slider')->default(true)
                ->helperText('Reels can also be picked inside case studies.'),
            Fields::visible(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Fields::imageColumn('image', 'Cover'),
                TextColumn::make('caption')->label('Caption')->wrap(),
                TextColumn::make('views'),
                IconColumn::make('video')->label('Video')->boolean(),
                ToggleColumn::make('in_hero')->label('In hero'),
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
        return ['index' => ManageReels::route('/')];
    }
}
