<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use Illuminate\Database\Seeder;

/**
 * Starter text for the details pages of the original case studies.
 * SAMPLE COPY — replace with each client's real, approved story in the admin.
 * Only fills fields that are still empty, so it never overwrites admin edits.
 */
class CaseStudyDetailsSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->details() as $slug => $fields) {
            $case = CaseStudy::query()->where('slug', $slug)->first();
            if (! $case) {
                continue;
            }

            foreach ($fields as $key => $value) {
                if (blank($case->{$key}) || $case->{$key} === ['en' => null, 'ar' => null]) {
                    $case->{$key} = $value;
                }
            }
            $case->save();
        }
    }

    private function details(): array
    {
        return [
            'dr-alyaa-beauty-clinic' => [
                'headline' => [
                    'en' => '1.2M reel views in 7 days for a dermatology & aesthetics clinic',
                    'ar' => '+1.2 مليون مشاهدة للريلز في 7 أيام لعيادة جلدية وتجميل',
                ],
                'summary' => [
                    'en' => 'The clinic delivered great results in the treatment room but had almost no presence online. We built a reels-first content system around the doctor herself — and turned views into booked consultations.',
                    'ar' => 'كانت نتائج العيادة رائعة داخل غرفة الكشف، لكن حضورها على السوشيال ميديا كان شبه معدوم. بنينا نظام محتوى يعتمد على الريلز وتقدّمه الطبيبة بنفسها — وحوّلنا المشاهدات إلى استشارات محجوزة.',
                ],
                'location' => ['en' => 'Damanhour, Egypt', 'ar' => 'دمنهور، مصر'],
                'duration' => ['en' => '3 months', 'ar' => '3 أشهر'],
                'services_used' => [
                    ['text' => ['en' => 'Medical content & reels', 'ar' => 'المحتوى الطبي والريلز']],
                    ['text' => ['en' => 'Paid ads', 'ar' => 'الإعلانات الممولة']],
                    ['text' => ['en' => 'WhatsApp follow-up', 'ar' => 'متابعة واتساب']],
                ],
                'challenge' => [
                    'en' => "The clinic relied on word of mouth and occasional boosted posts. Content was generic stock design, the doctor never appeared on camera, and WhatsApp messages were answered hours later — so most inquiries went cold.\n\n- Under 2,000 views per post\n- No way to know which post brought which patient\n- Weekday afternoons mostly empty",
                    'ar' => "كانت العيادة تعتمد على التوصيات وبعض المنشورات الممولة من وقت لآخر. التصميمات كانت عامة، والطبيبة لم تظهر أمام الكاميرا أبدًا، ورسائل واتساب كان يتم الرد عليها بعد ساعات — فأغلب الاستفسارات كانت تضيع.\n\n- أقل من 2,000 مشاهدة لكل منشور\n- لا توجد طريقة لمعرفة أي منشور جاب أي مريض\n- فترات بعد الظهر في أيام الأسبوع شبه فارغة",
                ],
                'solution' => [
                    'en' => "We started with one content day a month at the clinic: the doctor answering the questions patients actually ask, short treatment explanations within medical advertising rules, and behind-the-scenes reels.\n\n- 12 scripted reels a month in Egyptian Arabic\n- Ads behind the 3 best-performing reels each week\n- A WhatsApp booking script and reply templates for reception",
                    'ar' => "بدأنا بيوم تصوير شهري في العيادة: الطبيبة تجاوب على الأسئلة التي يسألها المرضى فعلًا، وشرح مختصر للجلسات في حدود قواعد الإعلان الطبي، وريلز من الكواليس.\n\n- 12 ريل شهريًا بسكريبت باللهجة المصرية\n- إعلانات على أفضل 3 ريلز أداءً كل أسبوع\n- سكريبت حجز ورسائل جاهزة على واتساب لفريق الاستقبال",
                ],
                'results' => [
                    'en' => 'In the first 7 days after launch the reels passed 1.2 million views. Over the next two months booked consultations grew 2.4x, and reception now traces every booking back to the reel that brought it.',
                    'ar' => 'خلال أول 7 أيام من الإطلاق تخطت الريلز 1.2 مليون مشاهدة. وخلال الشهرين التاليين تضاعفت الاستشارات المحجوزة 2.4 مرة، وأصبح فريق الاستقبال يعرف كل حجز جاء من أي ريل.',
                ],
            ],

            'mostafa-el-naggar-hospital' => [
                'headline' => [
                    'en' => '+180% patient inquiries in 90 days for a specialist heart hospital',
                    'ar' => '+180% زيادة في استفسارات المرضى خلال 90 يومًا لمستشفى قلب متخصص',
                ],
                'summary' => [
                    'en' => "A respected cardiology hospital with decades of experience, but a digital presence that didn't reflect it. We made its surgeons the face of the hospital and built campaigns per department.",
                    'ar' => 'مستشفى قلب له سمعة وخبرة طويلة، لكن حضوره الرقمي لم يكن يعكس ذلك. جعلنا الجراحين وجه المستشفى، وبنينا حملات منفصلة لكل قسم.',
                ],
                'location' => ['en' => 'Damanhour, Egypt', 'ar' => 'دمنهور، مصر'],
                'duration' => ['en' => '90 days', 'ar' => '90 يومًا'],
                'services_used' => [
                    ['text' => ['en' => 'Medical content & reels', 'ar' => 'المحتوى الطبي والريلز']],
                    ['text' => ['en' => 'Paid ads per department', 'ar' => 'إعلانات ممولة لكل قسم']],
                    ['text' => ['en' => 'Call tracking & CRM', 'ar' => 'تتبع المكالمات وCRM']],
                ],
                'challenge' => [
                    'en' => "Patients searching for heart specialists in the Delta found competitors first. The hospital's pages posted announcements rather than answers, and the ad budget was spread thin across every service.\n\n- High cost per lead on generic campaigns\n- Surgeons unknown outside their own patients\n- Calls not tracked by department",
                    'ar' => "المرضى الذين يبحثون عن أطباء قلب في الدلتا كانوا يجدون المنافسين أولًا. صفحات المستشفى كانت تنشر إعلانات وأخبار بدل الإجابة على أسئلة المرضى، وميزانية الإعلانات كانت موزعة على كل الخدمات.\n\n- تكلفة عالية لكل عميل محتمل في الحملات العامة\n- الجراحون غير معروفين خارج دائرة مرضاهم\n- المكالمات غير متتبعة حسب القسم",
                ],
                'solution' => [
                    'en' => "We filmed the surgical team explaining procedures in simple language, shared behind-the-scenes from the cath lab and operating room, and split the ad budget by department, each with its own landing page and WhatsApp line.\n\n- Department campaigns: cardiac surgery, cath lab, vascular\n- Surgeon introduction reels\n- Call and WhatsApp tracking per campaign",
                    'ar' => "صوّرنا الفريق الجراحي وهو يشرح العمليات بلغة بسيطة، وشاركنا كواليس من القسطرة وغرفة العمليات، وقسّمنا ميزانية الإعلانات حسب القسم مع صفحة هبوط ورقم واتساب لكل قسم.\n\n- حملات لكل قسم: جراحة القلب، القسطرة، الأوعية الدموية\n- ريلز تعريفية بالجراحين\n- تتبع المكالمات وواتساب لكل حملة",
                ],
                'results' => [
                    'en' => 'Within 90 days patient inquiries rose 180% while cost per lead dropped 38%. The surgeon reels alone passed 840K views, and the hospital now plans its budget by department based on real booking data.',
                    'ar' => 'خلال 90 يومًا زادت استفسارات المرضى بنسبة 180% وانخفضت تكلفة العميل المحتمل 38%. ريلز الجراحين وحدها تخطت 840 ألف مشاهدة، وأصبح المستشفى يخطط ميزانيته لكل قسم بناءً على بيانات حجز حقيقية.',
                ],
            ],
        ];
    }
}
