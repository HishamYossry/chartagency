# Deploying Chart Agency — manual reference

> Day-to-day deploys now happen from GitHub — see [../DEPLOY.md](../DEPLOY.md). This page is the detailed reference: requirements, settings, troubleshooting, and the manual (zip) route.

Two deployments on Hostinger, **admin first**. The website pre-renders its pages from the admin's API, so the API must be live before the website is built.

```
admin.chartagencydemo.com   Laravel 13 + Filament 5  — admin panel, uploads, content API   (admin/)
chartagencydemo.com         Next.js 16 (Node app)     — the public website, EN + AR          (web/)
```

**Contents:** [Requirements](#requirements) · [How it fits together](#how-it-fits-together) · [Stage 1 — Admin](#stage-1--admin-laravel) · [Stage 2 — Website](#stage-2--website-nextjs) · [After both are live](#after-both-are-live) · [Updating a live site](#updating-a-live-site) · [Troubleshooting](#troubleshooting) · [Day-to-day](#day-to-day) · [Local development](#local-development) · [Rolling back](#rolling-back)

---

## Requirements

| | Needed |
|---|---|
| Hosting | Hostinger plan with **PHP + MySQL** and **Node.js apps** (same setup as taam) |
| PHP | **8.3 or newer** (Laravel 13), extensions: `pdo_mysql`, `intl`, `gd`, `zip`, `fileinfo`, `mbstring` |
| MySQL | 8.x |
| Composer | 2.x (available in Hostinger's terminal) |
| Node.js | **20.9 or newer** — on your machine to build, and on Hostinger to run |
| SSL | On both the main domain and the `admin` subdomain |

---

## How it fits together

- The website reads all content from the admin API and caches it:
  - `GET /api/v1/content?locale=en|ar` — everything on the home page
  - `GET /api/v1/case-studies/{slug}?locale=en|ar` — one case study details page
- Every save in the admin calls `https://chartagencydemo.com/api/revalidate/` with a shared secret, so changes are live on the next page view. Pages also refresh themselves hourly as a safety net.
- The "Book a strategy call" form opens WhatsApp **and** saves the lead to the admin (`POST /api/v1/leads`), which emails `LEAD_NOTIFY_EMAIL`. The email is sent immediately — no queue worker or cron job is needed.
- If the admin is ever down, the website keeps serving its last cached pages.
- Uploaded images and videos live in the admin's `public/uploads/` and are served from `https://admin.chartagencydemo.com/uploads/…`.

### The shared secret

Generate it once and put the **same value** in both `.env` files (`FRONTEND_REVALIDATE_SECRET` in the admin, `REVALIDATE_SECRET` on the website):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Stage 1 — Admin (Laravel)

### 1.1 Database

hPanel → Databases → MySQL → create a database and user (e.g. `uXXXXXXXX_chartadmin`). Keep the password.

### 1.2 Subdomain

hPanel → Domains → Subdomains → create `admin` → `admin.chartagencydemo.com`.
Point its document root at the project's **`public/`** folder, e.g. `domains/chartagencydemo.com/chartagency-admin/public`.
Then hPanel → Security → SSL → install for the subdomain.

hPanel → Advanced → PHP Configuration → select **PHP 8.3** (or newer) for the subdomain.

### 1.3 Upload the code

Upload `chartagency-admin/` **without**:

```
vendor/   node_modules/   .env   storage/logs/*   public/uploads/*
```

Keep `database/seeders/data/` — it holds the original content and images the first import uses.

### 1.4 Configure `.env`

```bash
cd ~/domains/chartagencydemo.com/chartagency-admin
cp .env.example .env
```

Then edit `.env`:

| Key | Value |
|---|---|
| `APP_URL` | `https://admin.chartagencydemo.com` |
| `APP_ENV` / `APP_DEBUG` | `production` / `false` |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | from step 1.1 |
| `MAIL_*` | your Hostinger mailbox (e.g. `no-reply@chartagencydemo.com`, `smtp.hostinger.com`, port 465, `smtps`) |
| `FRONTEND_URL` | `https://chartagencydemo.com` — exact, no trailing slash (used for CORS and page refreshes) |
| `FRONTEND_REVALIDATE_SECRET` | the shared secret |
| `LEAD_NOTIFY_EMAIL` | who receives new leads, e.g. `sales@chartagency.com` |

### 1.5 Install (hPanel → Advanced → Terminal / SSH)

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force      # FIRST TIME ONLY — imports the website content, images and case study texts
php artisan make:filament-user   # your admin login (gets the "admin" role)
php artisan optimize
php artisan filament:optimize
```

The import is safe to repeat: it skips everything if content already exists, and the case study texts only fill empty fields. To deliberately reset all content to the original: `SEED_OVERWRITE=1 php artisan db:seed --force`.

### 1.6 Upload limits and permissions

Reel and testimonial videos can be up to 50 MB. hPanel → Advanced → PHP Configuration:

```
upload_max_filesize = 64M
post_max_size       = 64M
max_execution_time  = 120
```

Make sure `public/uploads/` and `storage/` (and `bootstrap/cache/`) are writable.

### 1.7 Confirm

```
https://admin.chartagencydemo.com/                                          → login page
https://admin.chartagencydemo.com/api/v1/content?locale=ar                  → JSON with Arabic content
https://admin.chartagencydemo.com/api/v1/case-studies/dr-alyaa-beauty-clinic → JSON for one case study
```

Log in and open Content → Reels — the thumbnails should show.

---

## Stage 2 — Website (Next.js)

### 2.1 Configure `.env.production` (on your machine)

```bash
cd web
cp .env.production.example .env.production   # first time only
```

| Key | Value |
|---|---|
| `CMS_API_URL` | `https://admin.chartagencydemo.com` (content, images and the lead form) |
| `SITE_URL` | `https://chartagencydemo.com` |
| `REVALIDATE_SECRET` | the shared secret |

All three values are read when the server starts, so they can also be set — or changed later — in hPanel's Node.js environment variables. Values set there override the file.

### 2.2 Build the package

```bash
bash deploy-package.sh
```

The script:

- refuses to build without `.env.production` or with a placeholder secret;
- moves `.env.local` aside during the build, so the local admin address isn't used to pre-render the pages;
- deletes the old build first, so no stale cached content is reused;
- pre-renders both languages of the home page **and every case study page** from the live admin — so Stage 1 must be done.

Output: `deploy/`.

### 2.3 Upload

Upload the **contents** of `deploy/` to the main domain's app root:

```
server.js   .env.production   .next/   node_modules/   public/
```

### 2.4 Node app

hPanel → Advanced → **Node.js**:

| Field | Value |
|---|---|
| Node version | 20.x or newer |
| Application root | the folder you uploaded to |
| Application URL | chartagencydemo.com |
| Startup file | `server.js` |

Environment variables: `NODE_ENV=production`, `HOSTNAME=0.0.0.0`, `PORT` as assigned. Then **Restart**.

### 2.5 Confirm

```
https://chartagencydemo.com/                                       → redirects to /en/ or /ar/ (browser language)
https://chartagencydemo.com/ar/                                    → Arabic site, images from admin.chartagencydemo.com/uploads
https://chartagencydemo.com/en/case-studies/dr-alyaa-beauty-clinic/ → case study details page
https://chartagencydemo.com/en/case-studies/does-not-exist/         → 404
```

---

## After both are live

Walk through these once — each one proves a different connection works:

1. **Edits go live:** in the admin change any text (Website → Site content), click *Save & publish*, reload the website — the change appears.
2. **New case study:** add a case study in Content → Case studies, then open *View on website* — its page works without a rebuild.
3. **Leads:** submit the form on the website — WhatsApp opens, the lead appears under Sales → Leads, and the email arrives at `LEAD_NOTIFY_EMAIL`.
4. **Uploads:** upload a short video to a reel — it plays on the site and opens full screen with sound when clicked.
5. **Language switch:** on a case study page, switch language — you stay on the same case study.

### Before launch

- Replace the **placeholder figures** (stats, case study numbers), the **sample testimonials** and the **sample case study stories** with real, approved ones.
- Add the real **social links** (Website → Site content → General). Empty links are hidden.
- Delete the test case study ("Dr Hisham") if it is still there.
- Use strong passwords for every admin user (Settings → Users).
- If `chartagencydemo.com` is a staging copy of a future live domain, keep it out of Google (hPanel → Security → Directory Privacy) so the two don't compete in search.

---

## Moving from temporary to real domains

No rebuild or re-upload needed — both sides read their addresses at startup.

1. **Admin** `.env`: set `APP_URL` (the admin's new address) and `FRONTEND_URL` (the website's new address), then run `php artisan optimize`. Image links follow `APP_URL` automatically.
2. **Website** environment (hPanel → Node.js, or `.env.production` in the app folder): set `CMS_API_URL` (the admin's new address) and `SITE_URL`, then **Restart**.
3. Point the domains / subdomain at the same folders and install SSL for them.
4. In the admin, click **Save & publish** once (Website → Site content) so every page is rebuilt with the new addresses.

## Updating a live site

Always **admin first**, then the website.

### Admin

1. Back up the database (phpMyAdmin → Export) and `public/uploads/`.
2. Upload the changed files (same exclusions as 1.3 — never overwrite `.env` or `public/uploads/`).
3. In the terminal:

```bash
cd ~/domains/chartagencydemo.com/chartagency-admin
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan optimize
php artisan filament:optimize
```

**Upgrading from the version without case study pages:** `migrate` adds the new case study fields and creates each page address from the English name. To also fill the starter texts for the two original case studies (only empty fields are touched), run once:

```bash
php artisan db:seed --class=CaseStudyDetailsSeeder --force
```

### Website

```bash
bash deploy-package.sh
```

Upload the new `deploy/` contents (replacing the old ones) and **Restart** the Node app.

---

## Troubleshooting

| Problem | Check |
|---|---|
| Website pages load unstyled | `.next/static` did not upload — re-upload the full `deploy/` contents. |
| Admin edits don't appear on the website | The two secrets must match exactly; `FRONTEND_URL` must be the website's real `https://` address. Look in the admin's `storage/logs/laravel.log` for "Frontend revalidation failed". Pages still refresh by themselves within an hour. |
| Form shows an error / leads don't arrive in the admin | `FRONTEND_URL` must match the website's origin exactly (https, no trailing slash) or the browser blocks the request (CORS). `CMS_API_URL` must be the admin's public `https://` address. |
| Lead saved but no email | `MAIL_*` settings in the admin `.env`; the lead is never lost even when mail fails. |
| Upload fails or stops at 100% | PHP limits from 1.6; files over 50 MB are rejected by design; `public/uploads/` must be writable. |
| Admin shows "404" or a file listing | The subdomain's document root must point at `chartagency-admin/public`, not the project root. |
| Admin shows "403 Forbidden" after login | The user's role must be `admin` or `editor` (Settings → Users, or set `role` in the `users` table). |
| A case study page returns 404 | It must be switched on (*Visible on website*). The address is `/case-studies/` + the *Page address* on its Details tab. |
| Images show on the admin but not the website | `APP_URL` in the admin `.env` must be the public `https://admin…` address — image links are built from it. |
| Website shows old content right after deploying | Make sure you built with `deploy-package.sh` (it clears the old build), then restart the Node app. |

---

## Day-to-day

| To change… | Go to (admin) |
|---|---|
| Headlines, paragraphs, stats, contact details, socials, SEO, section images | Website → Site content |
| Reels (images / videos, captions, which appear in the hero) | Content → Reels |
| Client logos strip | Content → Clients |
| Case studies — home page card (stats, reels) and the details page `/en/case-studies/{slug}/` (headline, intro, cover, facts, challenge / what we did / results, client quote, SEO) | Content → Case studies (tabs: Home page card · Details page · SEO) |
| Services, process steps, testimonials, FAQ | Content → … |
| Enquiries from the form | Sales → Leads |
| Admin accounts (admins only) | Settings → Users |

- Lists can be reordered by drag and drop (the ⇅ button), and any item can be hidden with *Visible on website* without deleting it.
- **Case studies:** each one gets its own page automatically — no rebuild needed. The home page card shows the first 3 stats and reels; the details page shows all (up to 6 stats and 9 reels). The page address is created from the English name unless you set one; changing it later breaks links already shared.
- **Story fields:** an empty line starts a new paragraph; a line starting with `- ` becomes a bullet point.
- **Arabic fields** may be left empty — the website then shows the English text — except optional title parts, which stay empty on purpose.
- **Videos:** MP4 (H.264), vertical 9:16, up to 50 MB. They play muted on loop in the page and with sound when clicked.
- **On the website,** every reel, photo and video opens full screen when clicked: videos play with sound, photos zoom on click (pinch on phones), and arrows / swipe browse the rest of the group.
- **Code-level text** (navigation labels, form labels and messages, viewer buttons, the decorative phone-mockup screens) stays in `src/i18n/dictionaries/en.ts` / `ar.ts`; those dictionaries are also the fallback content if the API cannot be reached.

---

## Local development

```bash
# admin — http://localhost:8010 (login admin@chartagency.test / password — local only)
cd admin
C:/laragon/bin/php/php-8.3.28-Win32-vs16-x64/php.exe artisan serve --port=8010

# website — http://localhost:3300, reads the local admin via .env.local
cd web
npm run dev
```

`.env.local` (website):

```
CMS_API_URL=http://localhost:8010
REVALIDATE_SECRET=local-dev-secret
```

Laragon's default PHP is 8.2; the admin needs 8.3, hence the full path above (or switch Laragon to 8.3: Menu → PHP → Version).

If a local `npm run build` shows outdated content, delete `.next/cache/fetch-cache` first — the deploy script does this automatically.

---

## Rolling back

- **Website:** keep the previous `deploy/` folder; re-upload it and restart the Node app.
- **Admin code:** re-upload the previous files, then `php artisan optimize:clear && php artisan optimize`.
- **Admin database:** restore the phpMyAdmin export. To undo only the latest migration: `php artisan migrate:rollback --step=1` (the case study details migration removes those fields and their content).
