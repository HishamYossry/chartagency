<?php

namespace App\Filament\Pages;

use App\Filament\Support\Fields;
use App\Models\Setting;
use App\Support\Media;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\DB;
use UnitEnum;

/**
 * Text, numbers and images of every website section that is not a list.
 * Lists (reels, case studies, services...) have their own screens under "Content".
 */
class SiteContent extends Page
{
    /** Settings rows edited here — one per website section */
    public const SECTIONS = ['general', 'hero', 'mission', 'cases', 'why', 'services', 'process', 'testimonials', 'faq', 'contact', 'footer'];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPencilSquare;

    protected static string|UnitEnum|null $navigationGroup = 'Website';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Site content';

    /** @var array<string, mixed>|null */
    public ?array $data = [];

    public function mount(): void
    {
        $all = Setting::allSections();
        $this->form->fill(collect(self::SECTIONS)->mapWithKeys(fn ($key) => [$key => $all[$key] ?? []])->all());
    }

    public function form(Schema $schema): Schema
    {
        return $schema->statePath('data')->components([
            Tabs::make('sections')->persistTabInQueryString()->tabs([
                $this->generalTab(),
                $this->heroTab(),
                $this->missionTab(),
                $this->casesTab(),
                $this->whyTab(),
                $this->sectionHeadsTab(),
                $this->processTab(),
                $this->contactTab(),
            ]),
        ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([$this->getFormContentComponent()]);
    }

    public function getFormContentComponent(): Component
    {
        return Form::make([EmbeddedSchema::make('form')])
            ->id('form')
            ->livewireSubmitHandler('save')
            ->footer([
                Actions::make([
                    Action::make('save')->label('Save & publish')->submit('save')->keyBindings(['mod+s']),
                ])->sticky()->key('form-actions'),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        DB::transaction(function () use ($data) {
            foreach (self::SECTIONS as $key) {
                Setting::put($key, $data[$key] ?? []);
            }
        });

        Notification::make()->success()->title('Saved — the website updates within seconds.')->send();
    }

    // --- tabs -------------------------------------------------------------

    private function generalTab(): Tab
    {
        return Tab::make('General')->icon(Heroicon::OutlinedCog6Tooth)->schema([
            Section::make('Contact details')->schema([
                Grid::make(['default' => 1, 'md' => 3])->schema([
                    TextInput::make('general.whatsapp')->label('WhatsApp number')->helperText('International format, e.g. 201014915106')->required(),
                    TextInput::make('general.phone_display')->label('Phone (as displayed)')->placeholder('+20 101 491 5106'),
                    TextInput::make('general.email')->label('Email')->email(),
                ]),
                Fields::tr('general.address', 'Address'),
            ]),
            Section::make('Social links')->description('Leave empty to hide the icon.')->schema([
                Grid::make(['default' => 1, 'md' => 2])->schema([
                    TextInput::make('general.socials.instagram')->label('Instagram')->url(),
                    TextInput::make('general.socials.facebook')->label('Facebook')->url(),
                    TextInput::make('general.socials.tiktok')->label('TikTok')->url(),
                    TextInput::make('general.socials.linkedin')->label('LinkedIn')->url(),
                ]),
            ]),
            Section::make('Availability badge')->description('The "November · Only 3 slots left" pill in the hero and final call-to-action.')->schema([
                Fields::tr('general.slots_month', 'Month'),
                Fields::tr('general.slots_text', 'Text'),
            ]),
            Section::make('SEO')->collapsed()->schema([
                Fields::tr('general.meta_title', 'Page title (browser tab & Google)'),
                Fields::tr('general.meta_description', 'Meta description', textarea: true),
            ]),
        ]);
    }

    private function heroTab(): Tab
    {
        return Tab::make('Hero')->icon(Heroicon::OutlinedHome)->schema([
            Section::make('Headline')->schema([
                ...$this->accentFields('hero'),
                Fields::tr('hero.lead', 'Intro paragraph', textarea: true),
                Fields::tr('hero.cta', 'Button text'),
                Fields::tr('hero.trust', '"Trusted by" line above the logos'),
            ]),
            Section::make('Phone in the middle')->schema([
                $this->images('hero.phone_images', 'Slideshow images (vertical 9:16)', 'hero'),
                Grid::make(2)->schema([
                    TextInput::make('hero.phone_handle')->label('Account handle')->placeholder('@dr.clinic'),
                    TextInput::make('hero.phone_caption')->label('Caption (Arabic)')->extraInputAttributes(['dir' => 'rtl']),
                ]),
            ]),
            Section::make('Floating stat cards')->columns(['default' => 1, 'lg' => 2])->schema([
                $this->statCard('hero.glass_a', 'Left card'),
                $this->statCard('hero.glass_b', 'Right card'),
            ]),
            Section::make('Reels slider')->description('Managed under Content → Reels ("Show in the hero slider").'),
        ]);
    }

    private function missionTab(): Tab
    {
        return Tab::make('Mission')->icon(Heroicon::OutlinedFlag)->schema([
            Section::make('Heading')->schema([
                Fields::tr('mission.chip', 'Small tag'),
                ...$this->accentFields('mission'),
            ]),
            Section::make('CEO card')->schema([
                Fields::tr('mission.ceo_eyebrow', 'Eyebrow'),
                Fields::tr('mission.ceo_title', 'Title'),
                Fields::tr('mission.ceo_text', 'Text', textarea: true),
                Fields::tr('mission.signature', 'Signature'),
                Fields::tr('mission.role', 'Name & role'),
            ]),
            Section::make('Photo card')->schema([
                Fields::image('mission.photo', 'Photo', 'site'),
                Fields::tr('mission.photo_alt', 'Photo description'),
            ]),
            Section::make('Stats')->schema([
                Grid::make(3)->schema([
                    TextInput::make('mission.big.value')->label('Big number')->numeric(),
                    TextInput::make('mission.big.decimals')->label('Decimals')->numeric()->default(1),
                    TextInput::make('mission.big.suffix')->label('Suffix')->placeholder('M+'),
                ]),
                Fields::tr('mission.big.word', 'Words after the number'),
                Fields::tr('mission.big.text', 'Description', textarea: true),
                Grid::make(2)->schema([
                    TextInput::make('mission.retention.value')->label('Retention %')->numeric(),
                    TextInput::make('mission.engagement.value')->label('Engagement % (+)')->numeric(),
                ]),
                Fields::tr('mission.retention.label', 'Retention label'),
                Fields::tr('mission.engagement.label', 'Engagement label'),
            ]),
            Section::make('Quote strip')->schema([
                Fields::tr('mission.quote_text', 'Quote', textarea: true),
                Fields::tr('mission.quote_name', 'Name'),
                Fields::tr('mission.quote_role', 'Role'),
            ]),
        ]);
    }

    private function casesTab(): Tab
    {
        return Tab::make('Case studies')->icon(Heroicon::OutlinedTrophy)->schema([
            Section::make('Heading')->description('The case studies themselves are under Content → Case studies.')->schema([
                Fields::tr('cases.chip', 'Small tag'),
                ...$this->accentFields('cases'),
            ]),
            Section::make('Call-to-action block')->schema([
                ...$this->accentFields('cases', 'mid_title'),
                Fields::tr('cases.mid_cta', 'Button text'),
                $this->statsRepeater('cases.mid_stats', 2),
                Fields::tr('cases.mid_quote', 'Quote', textarea: true),
                Fields::tr('cases.mid_quote_by', 'Quote by'),
            ]),
        ]);
    }

    private function whyTab(): Tab
    {
        return Tab::make('Why Chart')->icon(Heroicon::OutlinedLightBulb)->schema([
            Section::make('Heading')->schema([
                Fields::tr('why.chip', 'Small tag'),
                ...$this->accentFields('why'),
            ]),
            Section::make('Platform mastery card')->schema([
                Fields::tr('why.platform_title', 'Title'),
                Fields::tr('why.platform_text', 'Text', textarea: true),
            ]),
            Section::make('Expert squad card')->schema([
                Fields::image('why.squad_image', 'Image', 'site'),
                Fields::tr('why.squad_tag', 'Tag on the image'),
                Fields::tr('why.squad_alt', 'Image description'),
                Fields::tr('why.squad_title', 'Title'),
                Fields::tr('why.squad_text', 'Text', textarea: true),
            ]),
            Section::make('Tall photo card')->schema([
                Fields::image('why.photo_image', 'Photo', 'site'),
                Fields::tr('why.photo_alt', 'Photo description'),
                Fields::tr('why.photo_title', 'Title'),
                Fields::tr('why.photo_text', 'Text'),
                Fields::tr('why.photo_cta', 'Button text'),
            ]),
            Section::make('Fast growth card')->schema([
                Fields::tr('why.growth_title', 'Title'),
                Fields::tr('why.growth_text', 'Text', textarea: true),
                Repeater::make('why.growth_pills')->label('Pills')->schema([Fields::tr('text', 'Pill')])
                    ->maxItems(3)->reorderable()->collapsible()->itemLabel(fn (array $state) => $state['text']['en'] ?? null),
            ]),
            Section::make('Clear analytics card')->schema([
                Fields::tr('why.analytics_title', 'Title'),
                Fields::tr('why.analytics_text', 'Text', textarea: true),
            ]),
        ]);
    }

    /** Headings of sections whose items live in their own screens. */
    private function sectionHeadsTab(): Tab
    {
        return Tab::make('Section headings')->icon(Heroicon::OutlinedBars3BottomLeft)->schema([
            Section::make('Services')->schema([
                Fields::tr('services.chip', 'Small tag'),
                Fields::tr('services.title', 'Title'),
                Fields::tr('services.cta', 'Button text'),
            ]),
            Section::make('Testimonials')->schema([
                Fields::tr('testimonials.chip', 'Small tag'),
                ...$this->accentFields('testimonials'),
            ]),
            Section::make('FAQ')->schema([
                Fields::tr('faq.chip', 'Small tag'),
                ...$this->accentFields('faq'),
                Fields::tr('faq.text', 'Text next to the questions', textarea: true),
                Fields::tr('faq.cta', 'WhatsApp button text'),
            ]),
        ]);
    }

    private function processTab(): Tab
    {
        return Tab::make('Process')->icon(Heroicon::OutlinedListBullet)->schema([
            Section::make('Heading')->description('The steps are under Content → Process steps.')->schema([
                Fields::tr('process.chip', 'Small tag'),
                Fields::tr('process.title_before', 'Title — first line'),
                Fields::tr('process.title_accent', 'Title — highlighted second line'),
            ]),
            Section::make('Images in the steps')->columns(2)->schema([
                Fields::image('process.call_avatar', 'Discovery call avatar', 'site'),
                Fields::image('process.content_day_image', 'Content day photo', 'site'),
            ]),
            Section::make('Stats bar')->schema([$this->statsRepeater('process.stats', 3)]),
        ]);
    }

    private function contactTab(): Tab
    {
        return Tab::make('Contact & footer')->icon(Heroicon::OutlinedEnvelope)->schema([
            Section::make('Final call-to-action')->schema([
                ...$this->accentFields('contact'),
                Fields::tr('contact.text', 'Text', textarea: true),
                $this->images('contact.cta_images', 'Reels around the box (4 vertical images)', 'site', 4),
            ]),
            Section::make('Footer')->schema([
                Fields::tr('footer.tagline', 'Tagline', textarea: true),
                TextInput::make('footer.word')->label('Big word at the bottom')->placeholder('Chart Agency'),
                Fields::tr('footer.rights', 'Copyright text'),
            ]),
        ]);
    }

    // --- helpers ----------------------------------------------------------

    /** @return array<Component> heading split into before / highlighted / after */
    private function accentFields(string $section, string $prefix = 'title'): array
    {
        return [
            Fields::tr("$section.{$prefix}_before", 'Title'),
            Fields::tr("$section.{$prefix}_accent", 'Highlighted word(s)'),
            Fields::tr("$section.{$prefix}_after", 'Title — after the highlight (optional)'),
        ];
    }

    private function statCard(string $path, string $label): Section
    {
        return Section::make($label)->compact()->schema([
            Grid::make(2)->schema([
                TextInput::make("$path.value")->label('Number')->numeric(),
                TextInput::make("$path.suffix")->label('Suffix')->placeholder('k+ / %'),
            ]),
            Fields::tr("$path.label", 'Label'),
        ]);
    }

    private function statsRepeater(string $path, int $max): Repeater
    {
        return Repeater::make($path)->label('Stats')->schema([
            Grid::make(2)->schema([
                TextInput::make('value')->label('Number')->numeric()->required(),
                TextInput::make('suffix')->label('Suffix')->placeholder('M+ / % / +'),
            ]),
            Fields::tr('label', 'Label'),
        ])->maxItems($max)->reorderable()->collapsible()
            ->itemLabel(fn (array $state) => trim(($state['value'] ?? '').($state['suffix'] ?? '').' '.($state['label']['en'] ?? '')));
    }

    private function images(string $path, string $label, string $directory, int $max = 6): FileUpload
    {
        return FileUpload::make($path)
            ->label($label)
            ->disk(Media::DISK)
            ->directory($directory)
            ->visibility('public')
            ->image()
            ->multiple()
            ->reorderable()
            ->appendFiles()
            ->maxFiles($max)
            ->maxSize(5120)
            ->panelLayout('grid');
    }
}
