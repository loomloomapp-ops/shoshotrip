# Deploy — ShoSho Trip (static export → Hostinger PHP/HTML)

The site is a Next.js app exported to **plain static HTML** (`output: 'export'`),
so it runs on any shared PHP/HTML hosting. There is no Node server in production.

## 1. Build the static site

```bash
npm install
npm run build
```

This produces the **`out/`** folder — the complete website (HTML, CSS, JS,
images, `lead.php`, `.htaccess`).

## 2. Upload

Upload the **contents of `out/`** into your Hostinger web root
(`public_html/`) via File Manager or FTP. Include the hidden files
`out/.htaccess`, `out/lead.php`, `out/lead.config.example.php`.

Final layout on the server:

```
public_html/
  index.html          → redirects / to /ua/ (or /en/ for English browsers)
  ua/ … en/ …          → the site
  _next/               → build assets
  media/               → images / video
  lead.php             → lead-form handler
  .htaccess            → 404 page, caching, protects secrets
```

## 3. Wire up the lead form

The lead form POSTs to `/lead.php`. To receive submissions:

1. Copy `lead.config.example.php` to **`lead.config.php`** in `public_html/`.
2. Fill in your Telegram bot token + chat id (and/or a webhook URL).

```php
<?php return [
  'TELEGRAM_BOT_TOKEN' => '123456:ABC...',
  'TELEGRAM_CHAT_ID'   => '111111111',
  'LEAD_WEBHOOK_URL'   => '',
  'GOOGLE_SHEETS_WEBHOOK_URL' => '',
];
```

`lead.config.php` is gitignored and denied by `.htaccess`. If nothing is
configured, leads are appended to `public_html/leads.log` so none are lost.

## Notes

- **URLs:** Ukrainian lives at `/ua/…`, English at `/en/…`; `/` redirects to the
  right one. This prefix is required for static hosting (no server rewrites).
- **`.htaccess`** needs Apache/LiteSpeed with mod_rewrite — the Hostinger
  default. It sets the 404 page, long-caches build assets, and blocks access to
  `lead.config.php` / `leads.log`.
- After content or code changes: re-run `npm run build` and re-upload `out/`.
- Analytics / site URL: set `NEXT_PUBLIC_*` values in `.env.local` before
  building (see `.env.example`).
