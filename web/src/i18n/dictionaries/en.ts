// English copy. The Arabic dictionary (ar.ts) must match this shape exactly.
// Reel captions and patient chats stay in Arabic in both languages — that's the content we produce.

const img = (path: string) => `/assets/img/${path}`;

export const en = {
  meta: {
    title: "Chart Agency — Medical Content & Marketing for Hospitals and Doctors",
    description:
      "Chart turns doctors' expertise into high-converting medical reels, ads and content that fill appointment books — for hospitals, clinics and labs across Egypt and the Gulf.",
  },

  lang: { switchTo: "العربية", short: "ع", label: "Switch to Arabic" },

  lightbox: { close: "Close", prev: "Previous", next: "Next", zoomIn: "Zoom in", zoomOut: "Zoom out", open: "View larger" },
  nav: {
    links: [
      { href: "#mission", label: "Our Mission" },
      { href: "#cases", label: "Case Studies" },
      { href: "#services", label: "Services" },
      { href: "#process", label: "Process" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "Book a Call",
    ctaLong: "Book a Strategy Call",
    openMenu: "Open menu",
    homeLabel: "Chart Agency home",
  },

  slots: { month: "November", text: "Only 3 slots left" },

  hero: {
    title: { before: "Turn your medical content into your most predictable", accent: "patient", after: "channel" },
    lead: "We script, film and edit high-converting medical Reels & Shorts for doctors, clinics and hospitals — then put ads behind them that turn viewers into booked appointments.",
    cta: "Book a Strategy Call",
    reels: [
      { img: img("reels/doctor-smiling.jpg"), alt: "Doctor in a white coat smiling to camera", views: "248K", cap: "٣ أعراض متتجاهلهاش أبداً" },
      { img: img("reels/surgery.jpg"), alt: "Surgeons operating under theatre lights", views: "1.2M", cap: "كواليس غرفة العمليات" },
      { img: img("reels/facial-peel.jpg"), alt: "Patient receiving a dermatology facial treatment", views: "530K", cap: "التقشير ولا الليزر؟" },
      { img: img("reels/eye-exam.jpg"), alt: "Ophthalmologist examining a patient's eyes", views: "94K", cap: "إمتى تحتاج تعمل ليزك؟" },
      { img: img("reels/doctor-scrubs.jpg"), alt: "Doctor in teal scrubs", views: "312K", cap: "دكتورة بتجاوب على أسئلتكم" },
      { img: img("reels/lab.jpg"), alt: "Lab technician pipetting samples", views: "76K", cap: "تحاليل لازم تعملها كل سنة" },
      { img: img("reels/dentist.jpg"), alt: "Dentist talking with a patient", views: "410K", cap: "ابتسامة هوليود في جلسة؟" },
      { img: img("reels/microneedling.jpg"), alt: "Microneedling skin treatment", views: "188K", cap: "النتيجة بعد ٣ جلسات" },
    ],
    phone: {
      following: "Following",
      forYou: "For You",
      handle: "@dr.clinic",
      caption: "يوم في حياة جراح 🩺 #صحتك_أولاً",
      sound: "♫ Original sound",
    },
    glassA: { to: 200, suffix: "k+", label: "Reels views" },
    glassB: { to: 15, suffix: "%", word: "", label: "More bookings" },
    trust: "Trusted by hospitals, clinics, labs & doctors across Egypt & the Gulf",
  },

  clients: [
    { img: img("clients/medical/mostafa-elnaggar-hospital.png"), name: "Mostafa El Naggar Hospital" },
    { img: img("clients/medical/dr-alyaa.png"), name: "Dr. Alyaa Beauty Clinic" },
    { img: img("clients/medical/damanhour-eye-center.png"), name: "Damanhour Eye Center" },
    { img: img("clients/medical/msg-clinics.png"), name: "MSG Clinics Ghoneim" },
    { img: img("clients/medical/tulip-lab.png"), name: "Tulip Lab" },
    { img: img("clients/medical/dr-manal-alattar.png"), name: "Dr. Manal Alattar" },
    { img: img("clients/medical/enjaz-lab.png"), name: "Enjaz Lab" },
    { img: img("clients/medical/dr-lamees-abdo.png"), name: "Dr. Lamees Abdo" },
  ],

  mission: {
    chip: "Our Mission",
    title: { before: "We help healthcare brands grow with", accent: "intention", after: "not just trends." },
    ceo: {
      eyebrow: "Our Mission",
      title: "We are not any regular Marketing Agency",
      text: "We work with doctors and hospitals who are ready to take their presence seriously. Not just to fill a feed or chase trends, but to build trust that turns into booked appointments. For us, content is just the starting point. Our approach combines medical accuracy, strategy, execution and consistency.",
      signature: "Adel",
      role: "Adel Hassabllah · CEO @Chart",
    },
    photoAlt: "Doctor recording medical content",
    // TODO: confirm these figures before going live
    big: { to: 12.6, decimals: 1, suffix: "M+", word: "Reels Views", text: "Delivered last month for our medical clients through content strategy, medical scripting, professional editing, posting schedule and performance analysis." },
    retention: { to: 92, label: "Client retention" },
    engagement: { to: 340, label: "Avg. engagement" },
    quote: {
      text: "“Excellent service and results that exceeded our expectations. A truly professional and cooperative team.”",
      name: "Mohamed Omar",
      role: "Director, Nour El Oyoun Center",
    },
  },

  // TODO: replace the figures in this section with each client's real, approved numbers
  cases: {
    chip: "Case Studies",
    title: { before: "Client Success", accent: "Stories", after: "" },
    items: [
      {
        slug: "dr-alyaa-beauty-clinic",
        dark: false,
        logo: img("clients/medical/dr-alyaa.png"),
        name: "Dr. Alyaa Beauty Clinic",
        specialty: "Dermatology & Aesthetics",
        spots: "",
        stats: [
          { prefix: "", to: 1.2, decimals: 1, suffix: "", word: "Million+", label: "Reels views", sub: "(last 7 days)" },
          { prefix: "+", to: 340, decimals: 0, suffix: "%", word: "", label: "Engagement", sub: "" },
          { prefix: "", to: 2.4, decimals: 1, suffix: "x", word: "", label: "Booked consultations", sub: "" },
        ],
        reels: [
          { img: img("reels/facial-peel.jpg"), alt: "Facial peel reel", views: "530K" },
          { img: img("reels/microneedling.jpg"), alt: "Microneedling reel", views: "188K" },
          { img: img("reels/doctor-scrubs.jpg"), alt: "Doctor Q&A reel", views: "312K" },
        ],
      },
      {
        slug: "mostafa-el-naggar-hospital",
        dark: true,
        logo: img("clients/medical/mostafa-elnaggar-hospital.png"),
        name: "Mostafa El Naggar Hospital",
        specialty: "Cardiology & Vascular",
        spots: "2 spots available for December",
        stats: [
          { prefix: "", to: 840, decimals: 0, suffix: "K+", word: "", label: "Reels views", sub: "" },
          { prefix: "+", to: 180, decimals: 0, suffix: "%", word: "", label: "Patient inquiries", sub: "" },
          { prefix: "−", to: 38, decimals: 0, suffix: "%", word: "", label: "Cost per lead", sub: "" },
        ],
        reels: [
          { img: img("reels/surgery.jpg"), alt: "Surgery reel", views: "1.2M" },
          { img: img("reels/doctor-man.jpg"), alt: "Surgeon introduction reel", views: "264K" },
          { img: img("reels/filming-surgery.jpg"), alt: "Behind the scenes reel", views: "97K" },
        ],
      },
    ],
    midCta: {
      title: { before: "Ready to see these kinds of results for your", accent: "clinic?", after: "" },
      cta: "Book a Strategy Call",
      stats: [
        { to: 1, suffix: "M+", label: "Reels views per month" },
        { to: 45, suffix: "%", word: "", label: "More bookings" },
      ],
      // TODO: replace with a real approved quote
      quote: "“For the first time, we know exactly which video brought which patient.”",
      quoteBy: "Clinic Director · Dermatology",
    },
  },

  caseDetail: {
    back: "All case studies",
    viewCase: "View case study",
    client: "Client",
    location: "Location",
    duration: "Duration",
    services: "Services",
    resultsTitle: "The results in numbers",
    reelsTitle: "Content we made",
    storyChip: "The story",
    challenge: "The challenge",
    solution: "What we did",
    results: "The results",
    nextCase: "Next case study",
    ctaTitle: { before: "Want results like these for your", accent: "practice?", after: "" },
    cta: "Book a Strategy Call",
  },

  why: {
    chip: "Why Chart?",
    title: { before: "Why the fastest growing practices", accent: "choose us.", after: "" },
    platform: { title: "Platform Mastery", text: "Instagram, TikTok, Facebook, Snapchat, YouTube and Google — we know what patients watch and search on each one." },
    squad: { title: "Medical Expert Squad", text: "Strategists, script writers and editors who only work in healthcare — and respect the ethics of medical advertising.", tag: "Medical-only team", alt: "Specialist reviewing dental x-rays" },
    photo: { title: "Grow with our expert team", text: "Expert strategies designed to make you the most trusted name in your specialty.", cta: "Get Started", alt: "Smiling doctor in a white coat" },
    growth: { title: "Fast Growth", text: "Achieve more engagement, stronger trust and more booked patients — month after month.", pills: ["+85% Reach in 30 days", "2x Higher bookings", "10x Organic reach"] },
    analytics: { title: "Clear Analytics", text: "See real performance: calls, WhatsApp chats, bookings and cost per patient — in one simple monthly report.", weeks: ["Week 1", "Week 2", "Week 3", "Week 4"] },
  },

  services: {
    chip: "Our Services",
    title: "Unlock your practice's true potential with us.",
    cta: "View Case Studies",
    items: [
      { chip: "Medical Reels", title: "Medical Content & Reels", text: "We turn your expertise into short-form videos that educate patients, build trust and grow your community — scripted in Egyptian & Gulf Arabic.", ticks: ["Monthly content day at your clinic", "Medical script writing & hooks", "Expert video editing & subtitles"] },
      { chip: "Patient Acquisition", title: "Paid Ads that Book Patients", text: "High-intent campaigns on Meta, TikTok, Snapchat and Google — targeted by specialty, area and procedure, and optimized for appointments, not likes.", ticks: ["Meta, TikTok, Snapchat & Google Ads", "Offers & landing pages per service", "Weekly optimization & scaling"] },
      { chip: "Websites", title: "Medical Websites & Booking", text: "Fast, bilingual websites and landing pages with online booking, WhatsApp and call tracking — built to convert visitors into patients.", ticks: ["Arabic & English, mobile-first", "Online booking & WhatsApp buttons", "Call & conversion tracking"] },
      { chip: "Local SEO", title: "Google Maps, SEO & Reviews", text: "Show up first when patients search for your specialty nearby — with an optimized Google Business Profile and a steady flow of 5-star reviews.", ticks: ["Google Business Profile optimization", "Review generation & management", "Arabic & English SEO content"] },
      { chip: "Lead Handling", title: "WhatsApp, CRM & Call Center", text: "Leads are only half the job. We set up WhatsApp automation, CRM pipelines and call-center scripts so every inquiry becomes a confirmed visit.", ticks: ["WhatsApp Business automation", "Call-center scripts & training", "Lead tracking dashboards"] },
    ],
    mock: {
      content: { heroTitle: "Doctor stories that convert", heroSub: "Watch our medical reels", watch: "Watch Now", stories: "Stories", isNew: "New" },
      ad: { handle: "dr.alyaa.clinic", sponsored: "Sponsored", offer: "Book your first consultation", book: "Book now", likes: "2,481 likes", leads: "+38 new leads today" },
      booking: {
        title: "Book your visit",
        dayLabel: "Select a day",
        days: [{ d: "Sat", n: "14" }, { d: "Sun", n: "15" }, { d: "Mon", n: "16" }, { d: "Tue", n: "17" }],
        timeLabel: "Available times",
        times: ["4:00 PM", "5:30 PM", "6:00 PM", "7:30 PM"],
        confirm: "Confirm appointment",
      },
      maps: { query: "dermatologist near me", yours: "Your Clinic", rating: "4.9 · 320 reviews", open: "Open · Closes 10 PM", buttons: ["Call", "Directions", "Book"], other: "Other clinic", otherRating: "4.1 · 46 reviews" },
      chat: {
        name: "Eye Center",
        status: "online",
        messages: [
          { out: false, text: "مساء الخير، عايز أحجز كشف ليزك 👋" },
          { out: true, text: "أهلاً بحضرتك! متاح السبت ٥ م أو الأحد ٧ م، تحب أي معاد؟" },
          { out: false, text: "السبت ٥ لو سمحت ✅" },
          { out: true, text: "تم الحجز ✔️ هنبعتلك تذكير قبل المعاد بيوم." },
        ],
      },
    },
  },

  process: {
    chip: "Process",
    title: { before: "How Chart Works", accent: "Simple 5-Week System", after: "" },
    weeks: ["Week 01", "Week 02", "Week 03", "Week 04", "Week 05"],
    steps: [
      { title: "Discovery Call", text: "We learn your specialty, services, patients and goals, and audit your current accounts." },
      { title: "Content Day", text: "Our crew films a month of reels at your clinic in one easy session — scripts ready, no stress." },
      { title: "Making Viral Reels", text: "Editing, subtitles, hooks and medical review — every video built to stop the scroll." },
      { title: "You Approve & We Launch", text: "You approve every video, then we publish and run ads to bring patients from week one." },
    ],
    rec: "● REC",
    approved: "Approved by Dr.",
    live: "Campaign live",
    stats: [
      { to: 1, suffix: "M+", label: "Reels views" },
      { to: 45, suffix: "%", word: "", label: "More engagement" },
      { to: 30, suffix: "+", label: "Videos per month" },
    ],
  },

  // TODO: only the Mohamed Omar quote is from the old site; replace the others with real approved testimonials
  testimonials: {
    chip: "Testimonials",
    title: { before: "Real Stories,", accent: "Real Results", after: "" },
    items: [
      { video: false, img: "", quote: "“Excellent service and results that exceeded our expectations. A professional and cooperative team that understands how patients think.”", name: "Mohamed Omar", role: "Director, Nour El Oyoun Center", initials: "MO" },
      { video: true, img: img("reels/doctor-scrubs.jpg"), quote: "“Our calendar is full every weekday.”", name: "", role: "Dermatology clinic · Video review", initials: "" },
      { video: false, img: "", quote: "“They understood medical advertising rules from day one. The content feels professional and trustworthy, never cheap.”", name: "Marketing Manager", role: "Private hospital", initials: "MM" },
      { video: false, img: "", quote: "“I was nervous about being on camera. Their team made it easy, and now patients come in saying they watched my videos.”", name: "Consultant Surgeon", role: "Private practice", initials: "DS" },
      { video: true, img: img("reels/dentist.jpg"), quote: "“Implant bookings doubled in 2 months.”", name: "", role: "Dental center · Video review", initials: "" },
      { video: false, img: "", quote: "“The WhatsApp follow-up system alone doubled the leads that actually turned into lab visits.”", name: "Operations Lead", role: "Medical laboratory", initials: "LO" },
    ],
  },

  faq: {
    chip: "FAQs",
    title: { before: "Everything you need to", accent: "Know", after: "" },
    text: "Can't find your answer? Message us on WhatsApp and we'll reply within the hour on working days.",
    cta: "Ask on WhatsApp",
    items: [
      { q: "What kind of medical businesses do you work with?", a: "Hospitals, clinics, medical centers, labs, pharmacies and individual doctors — from dermatology and dental to cardiology, ophthalmology, IVF and plastic surgery." },
      { q: "Do I have to appear on camera?", a: "It's not required, but doctor-led videos build trust fastest. We handle scripts, directing and editing, so filming usually takes just a few hours a month." },
      { q: "Is your content compliant with medical advertising rules?", a: "Yes. We follow local healthcare advertising regulations and each platform's health-ad policies. No exaggerated claims or misleading before-and-afters — every script is reviewed by you before filming." },
      { q: "How long does it take to see results?", a: "Paid campaigns usually bring first inquiries within 1–2 weeks of launch. Organic reach and brand trust compound over 2–3 months of consistent posting." },
      { q: "How do you measure success?", a: "We track calls, WhatsApp chats, booked appointments and cost per patient — not just views. You get a monthly report and a strategy call." },
      { q: "Do you offer ongoing support?", a: "Yes. Most clients work with us on monthly plans with a dedicated account manager, weekly optimization and continuous content production." },
    ],
  },

  contact: {
    title: { before: "Ready to Unlock your", accent: "Growth", after: "" },
    text: "Tell us about your practice — we'll send a free content & marketing audit with a clear growth plan.",
    form: {
      name: "Full name",
      phone: "Phone / WhatsApp",
      practice: "Clinic / hospital name",
      specialty: "Specialty",
      specialties: ["Hospital", "Dermatology & Aesthetics", "Dental", "Ophthalmology", "Cardiology", "OB/GYN & IVF", "Medical Lab", "Plastic Surgery", "Other"],
      submit: "Book a Strategy Call",
      note: "Opens WhatsApp with your details — we reply within one working day.",
      error: "Please add your name and a valid phone number.",
      opening: "Opening WhatsApp…",
      message: {
        intro: "Hello Chart Agency, I would like to book a strategy call.",
        name: "Name",
        phone: "Phone",
        practice: "Practice",
        specialty: "Specialty",
      },
    },
    address: "Ard El Miri, Damanhour, Egypt",
  },

  footer: {
    tagline: "Medical content & marketing for hospitals, clinics and doctors in Egypt & the Gulf.",
    links: [
      { href: "#mission", label: "Our Mission" },
      { href: "#cases", label: "Case Studies" },
      { href: "#services", label: "Services" },
      { href: "#process", label: "Process" },
      { href: "#testimonials", label: "Testimonials" },
      { href: "#faq", label: "FAQs" },
      { href: "#contact", label: "Book a Call" },
    ],
    word: "Chart Agency",
    rights: "Chart Agency. All rights reserved.",
    photos: "Photos: Unsplash",
    whatsapp: "Chat with us on WhatsApp",
  },
};

export type Dictionary = typeof en;
