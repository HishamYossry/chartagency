<?php

namespace App\Filament\Resources\Testimonials;

use App\Filament\Resources\Testimonials\Pages\ManageTestimonials;
use App\Models\Testimonial;
use App\Filament\Support\Fields;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Table;
use UnitEnum;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $modelLabel = 'testimonial';

    protected static ?string $pluralModelLabel = 'Testimonials';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 6;

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(1)->components([
            Toggle::make('is_video')->label('Video review')->live(),
            Fields::image('image', 'Poster image (shown before the video plays)', 'testimonials')
                ->visible(fn (Get $get) => $get('is_video'))->required(fn (Get $get) => $get('is_video')),
            Fields::video('video', 'Review video', 'testimonials')->visible(fn (Get $get) => $get('is_video')),
            Fields::tr('quote', 'Quote', textarea: true, required: true),
            Fields::tr('name', 'Name (or job title)')->visible(fn (Get $get) => ! $get('is_video')),
            Fields::tr('role', 'Role / organisation', required: true),
            TextInput::make('initials')->label('Initials in the avatar')->maxLength(4)->visible(fn (Get $get) => ! $get('is_video')),
            Fields::visible(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Fields::imageColumn('image', 'Poster'),
                Fields::trColumn('quote', 'Quote'),
                Fields::trColumn('role', 'From'),
                IconColumn::make('is_video')->label('Video')->boolean(),
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
        return ['index' => ManageTestimonials::route('/')];
    }
}
