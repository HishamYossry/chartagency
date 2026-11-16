# Chart Agency — Admin

Laravel 13 + Filament 5 admin panel for **chartagencydemo.com**, served at **admin.chartagencydemo.com**.

- Edit every text, number and image on the website in English and Arabic
- Manage reels (images or videos), client logos, case studies, services, process steps, testimonials and FAQ
- Receive leads from the website form (saved here + emailed)
- Content API for the website: `GET /api/v1/content?locale=en|ar`, `POST /api/v1/leads`
- Every save refreshes the website automatically (`FRONTEND_URL` + `FRONTEND_REVALIDATE_SECRET`)

Deployment and day-to-day guide: see [`../DEPLOY.md`](../DEPLOY.md) (GitHub deploys) and [`../docs/DEPLOY-MANUAL.md`](../docs/DEPLOY-MANUAL.md).

Local: `php artisan serve --port=8010` → http://localhost:8010 (admin@chartagency.test / password, local only).
