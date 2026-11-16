# Chart Agency

Website and admin panel for Chart Agency — healthcare digital marketing, English + Arabic.

```
admin/   Laravel 13 + Filament 5 — admin panel, content API, uploads, leads   (PHP site)
web/     Next.js 16 — the public website, EN + AR                              (Node.js site)
```

The website reads all its content from the admin's API; every save in the admin refreshes the website within seconds.

- **Deploying** (GitHub → Hostinger): [DEPLOY.md](DEPLOY.md)
- **Detailed reference** (requirements, settings, troubleshooting, manual route): [docs/DEPLOY-MANUAL.md](docs/DEPLOY-MANUAL.md)

## Local development

```bash
# admin — http://localhost:8010  (local login: admin@chartagency.test / password)
cd admin
composer install
cp .env.example .env            # then set the local database (see admin/.env.example)
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8010

# website — http://localhost:3300
cd web
npm install
echo "CMS_API_URL=http://localhost:8010" > .env.local
echo "REVALIDATE_SECRET=local-dev-secret" >> .env.local
npm run dev
```

The admin needs PHP 8.3+; the website needs Node.js 20.9+.
