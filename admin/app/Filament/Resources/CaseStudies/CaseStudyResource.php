<?php

namespace App\Filament\Resources\CaseStudies;

use App\Filament\Resources\CaseStudies\Pages\CreateCaseStudy;
use App\Filament\Resources\CaseStudies\Pages\EditCaseStudy;
use App\Filament\Resources\CaseStudies\Pages\ListCaseStudies;
use App\Filament\Support\Fields;
use App\Models\CaseStudy;
use App\Models\Reel;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class CaseStudyResource extends Resource
{
    protected static ?string $model = CaseStudy::class;

    protected static ?string $modelLabel = 'case study';

    protected static ?string $pluralModelLabel = 'Case studies';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 3;

    private const PARAGRAPHS_HELP = 'Separate paragraphs with an empty line. Start a line with "- " to make a bullet point.';

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(1)->components([
            Tabs::make('case')->persistTabInQueryString()->tabs([
                Tab::make('Home page card')->icon(Heroicon::OutlinedRectangleGroup)->schema([
                    Section::make('Client')->schema([
                        Fields::tr('name', 'Client name', required: true),
                        Fields::tr('specialty', 'Specialty'),
                        Fields::image('logo', 'Logo', 'clients'),
                        Toggle::make('is_dark')->label('Dark card style'),
                        Fields::tr('spots', 'Availability note (optional, e.g. "2 spots available for December")'),
                    ]),
                    Section::make('Results')
                        ->description('Up to 6 numbers. The home page card shows the first 3; the details page shows all. Example: prefix "+", value 340, suffix "%", label "Engagement".')
                        ->schema([
                            Repeater::make('stats')->hiddenLabel()->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('prefix')->placeholder('+ or −')->maxLength(3),
                                    TextInput::make('value')->numeric()->required(),
                                    TextInput::make('decimals')->numeric()->default(0)->minValue(0)->maxValue(2),
                                    TextInput::make('suffix')->placeholder('% x K+ M+')->maxLength(6),
                                ]),
                                Fields::tr('word', 'Word after the number (optional, e.g. "Million")'),
                                Fields::tr('label', 'Label', required: true),
                                Fields::tr('sub', 'Small note (optional)'),
                            ])->maxItems(6)->reorderable()->collapsible()->cloneable()
                                ->itemLabel(fn (array $state) => trim(($state['prefix'] ?? '').($state['value'] ?? '').($state['suffix'] ?? '').' '.($state['label']['en'] ?? ''))),
                        ]),
                    Section::make('Reels')->schema([
                        Select::make('reel_ids')->hiddenLabel()->multiple()->maxItems(9)->reorderable()->searchable()->preload()
                            ->options(fn () => Reel::query()->orderBy('sort')->get()->mapWithKeys(fn (Reel $r) => [$r->id => trim(($r->caption ?: $r->tr('alt', 'en')).' · '.$r->views)]))
                            ->helperText('Up to 9, in order. The home page card shows the first 3; the details page shows all. Add new reels under Content → Reels.'),
                    ]),
                    Fields::visible(),
                ]),

                Tab::make('Details page')->icon(Heroicon::OutlinedDocumentText)->schema([
                    Section::make('Top of the page')->schema([
                        TextInput::make('slug')->label('Page address')
                            ->prefix('/case-studies/')->suffix('/')
                            ->alphaDash()->maxLength(80)
                            ->unique(ignoreRecord: true)
                            ->helperText('Leave empty to create it from the English name. Changing it breaks links already shared.'),
                        Fields::tr('headline', 'Headline (e.g. "1.2M reel views in 7 days for a beauty clinic")'),
                        Fields::tr('summary', 'Intro paragraph', textarea: true),
                        Fields::image('cover', 'Cover image (wide, optional)', 'cases')
                            ->helperText('Shown at the top of the page. Leave empty to show the reels instead.'),
                        Fields::tr('location', 'Location (e.g. "Damanhour, Egypt")'),
                        Fields::tr('duration', 'Project duration (e.g. "90 days")'),
                        Repeater::make('services_used')->label('Services used')->schema([Fields::tr('text', 'Service')])
                            ->reorderable()->collapsible()->defaultItems(0)
                            ->itemLabel(fn (array $state) => $state['text']['en'] ?? null),
                    ]),
                    Section::make('The story')->description(self::PARAGRAPHS_HELP)->schema([
                        Fields::tr('challenge', 'The challenge', textarea: true),
                        Fields::tr('solution', 'What we did', textarea: true),
                        Fields::tr('results', 'The results', textarea: true),
                    ]),
                    Section::make('Client quote (optional)')->schema([
                        Fields::tr('quote', 'Quote', textarea: true),
                        Fields::tr('quote_by', 'Name & role'),
                    ]),
                ]),

                Tab::make('SEO')->icon(Heroicon::OutlinedMagnifyingGlass)->schema([
                    Fields::tr('meta_title', 'Page title (browser tab & Google) — defaults to the headline'),
                    Fields::tr('meta_description', 'Meta description — defaults to the intro paragraph', textarea: true),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Fields::imageColumn('logo', 'Logo'),
                Fields::trColumn('name', 'Client'),
                Fields::trColumn('specialty', 'Specialty'),
                TextColumn::make('slug')->label('Page')->prefix('/case-studies/')->color('gray')->toggleable(),
                IconColumn::make('is_dark')->label('Dark')->boolean(),
                Fields::visibleColumn(),
            ])
            ->reorderable('sort')
            ->defaultSort('sort')
            ->recordActions([
                self::viewOnSiteAction(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }

    public static function viewOnSiteAction(): Action
    {
        return Action::make('view_on_site')
            ->label('View on website')
            ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
            ->color('gray')
            ->url(fn (CaseStudy $record) => rtrim((string) config('services.frontend.url'), '/')."/en/case-studies/{$record->slug}/", shouldOpenInNewTab: true)
            ->visible(fn (CaseStudy $record) => $record->is_active && filled($record->slug));
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCaseStudies::route('/'),
            'create' => CreateCaseStudy::route('/create'),
            'edit' => EditCaseStudy::route('/{record}/edit'),
        ];
    }
}
