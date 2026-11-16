# Deploying from GitHub

Repo: **github.com/HishamYossry/chartagency** (private). Push to `main` and both sites update:

| Part | Folder | Hostinger site | How it deploys |
|---|---|---|---|
| Admin (Laravel) | `admin/` | darkviolet-mole-729566.hostingersite.com — **PHP** site | GitHub Actions workflow `.github/workflows/deploy-admin.yml` — copies `admin/` over SSH, then migrates and refreshes caches |
| Website (Next.js) | `web/` | lavender-ibex-763599.hostingersite.com — **Node.js** site | Hostinger's own GitHub integration — builds and restarts on every push |

Passwords and keys never go into the repo: each server keeps its own `.env`, and the deploy key lives in GitHub's encrypted secrets.

Details on settings, troubleshooting and the manual zip route: [docs/DEPLOY-MANUAL.md](docs/DEPLOY-MANUAL.md).

---

## One-time setup

Do these once, in this order.

### 1. Admin site (darkviolet — PHP)

1. **PHP:** hPanel → darkviolet → Advanced → PHP Configuration → **PHP 8.3**; set `upload_max_filesize = 64M`, `post_max_size = 64M`, `max_execution_time = 120`.
2. **Database:** hPanel → darkviolet → Databases → MySQL → the database `u222692328_chartagency` must exist under **this** site.
3. **`.env`:** File Manager → darkviolet → `public_html` → delete the default index file → upload the prepared file **`admin.env`** (from `chartagency-release/`) and rename it to **`.env`**. It already holds the database, domains and shared secret.
4. **SSH access:** hPanel → darkviolet → Advanced → **SSH Access** → enable it. Note the **IP/host**, **port** (usually `65002`) and **username** (e.g. `u222692328`).
5. **Deploy key:** in the same SSH Access page → **Add SSH key** → paste the contents of `chartagency-release/deploy-key/chartagency_deploy.pub`.

### 2. GitHub secrets

GitHub → the repo → **Settings → Secrets and variables → Actions → New repository secret**, add:

| Name | Value |
|---|---|
| `SSH_HOST` | the IP/host from step 1.4 |
| `SSH_PORT` | the port from step 1.4 (e.g. `65002`) |
| `SSH_USER` | the username from step 1.4 |
| `SSH_PRIVATE_KEY` | the whole contents of `chartagency-release/deploy-key/chartagency_deploy` (the file **without** `.pub`), including the `-----BEGIN` / `-----END` lines |
| `ADMIN_PATH` | `domains/darkviolet-mole-729566.hostingersite.com/public_html` |

### 3. First admin deploy

1. GitHub → **Actions → Deploy admin → Run workflow** (branch `main`). It uploads the code, publishes the admin's CSS/JS, runs the database migrations and caches. Wait for the green tick.
2. hPanel → darkviolet → Advanced → **Terminal**, once:

   ```bash
   cd ~/domains/darkviolet-mole-729566.hostingersite.com/public_html
   chmod -R 775 storage bootstrap/cache public/uploads
   php artisan db:seed --force        # imports the website content and images
   php artisan make:filament-user     # your admin login
   php artisan optimize
   ```

3. Check https://darkviolet-mole-729566.hostingersite.com → login page → log in → Content → Reels shows images.

### 4. Website site (lavender — Node.js)

hPanel → lavender → **Node.js** → **Deploy from GitHub** (connect your GitHub account if asked) → repository **HishamYossry/chartagency**, branch **main**.

| Setting | Value |
|---|---|
| Root / app directory | `web` — if Hostinger offers this field. If not, leave the repo root: the root `package.json` forwards everything to `web/`. |
| Node version | 20 or 22 |
| Install command | `npm ci` (root directory `web`) — or `npm install` (repo root) |
| Build command | `npm run build` |
| Start command | `npm start` |
| Auto-deploy on push | **On** |

Environment variables:

| Name | Value |
|---|---|
| `CMS_API_URL` | `https://darkviolet-mole-729566.hostingersite.com` |
| `SITE_URL` | `https://lavender-ibex-763599.hostingersite.com` |
| `REVALIDATE_SECRET` | the same value as `FRONTEND_REVALIDATE_SECRET` in the admin `.env` (it's in `chartagency-release/UPLOAD-STEPS.md`) |
| `NODE_ENV` | `production` |

Deploy, then open https://lavender-ibex-763599.hostingersite.com — it opens `/en/` or `/ar/`.

### 5. Connect them

Admin → **Website → Site content → Save & publish**. The website switches to the admin's content; from then on every save is live within seconds.

---

## Every update after that

```bash
git add -A
git commit -m "What changed"
git push
```

- Changes in `admin/` → the **Deploy admin** workflow runs (GitHub → Actions shows progress). Database migrations run automatically.
- Any push → Hostinger rebuilds and restarts the website.
- **Content** (texts, images, reels, case studies, FAQ…) is edited in the admin — no deploy needed.

Never commit `.env` files — `.gitignore` already blocks them.

## When something goes wrong

| Problem | Check |
|---|---|
| Workflow fails at "SSH key" / "Upload files" | `SSH_HOST`, `SSH_PORT`, `SSH_USER` secrets; the public key is added in hPanel → SSH Access; `SSH_PRIVATE_KEY` contains the whole private key |
| Workflow says "No .env on the server yet" | Do step 1.3, then re-run the workflow |
| `php` too old in the workflow's last step | Hostinger's terminal PHP follows the site's PHP version — set PHP 8.3 (step 1.1) |
| Admin looks unstyled | The workflow publishes the styles — re-run it, or run `php artisan filament:assets` in the terminal |
| Website build fails on Hostinger | Node version 20+, build `npm run build`, start `npm start`; with the repo root as app directory the install command must be `npm install` |
| Website shows old content after a deploy | Admin → Site content → Save & publish |

More in [docs/DEPLOY-MANUAL.md](docs/DEPLOY-MANUAL.md#troubleshooting).
