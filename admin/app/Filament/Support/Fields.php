<?php

namespace App\Filament\Support;

use App\Support\Media;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Illuminate\Database\Eloquent\Model;

/** Form/table building blocks shared by every admin screen. */
class Fields
{
    /**
     * English and Arabic inputs side by side, stored as {"en": ..., "ar": ...}.
     * Arabic may be left empty — the website then shows the English text.
     */
    public static function tr(string $name, string $label, bool $textarea = false, bool $required = false): Grid
    {
        $make = function (string $locale) use ($name, $label, $textarea, $required) {
            $field = $textarea
                ? Textarea::make("$name.$locale")->rows(3)->autosize()
                : TextInput::make("$name.$locale");

            $field->label($label.($locale === 'en' ? ' — English' : ' — العربية'))
                ->required($required && $locale === 'en');

            if ($locale === 'ar') {
                $field->extraInputAttributes(['dir' => 'rtl', 'lang' => 'ar']);
            }

            return $field;
        };

        return Grid::make(['default' => 1, 'md' => 2])->schema([$make('en'), $make('ar')])->columnSpanFull();
    }

    public static function image(string $name, string $label, string $directory): FileUpload
    {
        return FileUpload::make($name)
            ->label($label)
            ->disk(Media::DISK)
            ->directory($directory)
            ->visibility('public')
            ->image()
            ->imageEditor()
            ->maxSize(5120) // KB
            ->helperText('JPG, PNG or WebP, up to 5 MB.');
    }

    public static function video(string $name, string $label, string $directory): FileUpload
    {
        return FileUpload::make($name)
            ->label($label)
            ->disk(Media::DISK)
            ->directory($directory)
            ->visibility('public')
            ->acceptedFileTypes(['video/mp4', 'video/webm', 'video/quicktime'])
            ->maxSize(51200) // KB
            ->helperText('Optional. MP4 (H.264) recommended, vertical 9:16, up to 50 MB. Plays muted on loop.');
    }

    public static function visible(): Toggle
    {
        return Toggle::make('is_active')->label('Visible on website')->default(true);
    }

    // --- table columns ---

    public static function trColumn(string $name, string $label): TextColumn
    {
        return TextColumn::make($name)
            ->label($label)
            ->getStateUsing(fn (Model $record) => $record->tr($name, 'en'))
            ->description(fn (Model $record) => $record->{$name}['ar'] ?? null)
            ->wrap()
            ->limit(80);
    }

    public static function imageColumn(string $name, string $label = 'Image'): ImageColumn
    {
        return ImageColumn::make($name)->label($label)->disk(Media::DISK)->height(56);
    }

    public static function visibleColumn(): ToggleColumn
    {
        return ToggleColumn::make('is_active')->label('Visible');
    }
}
