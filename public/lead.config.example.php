<?php
/**
 * Copy this file to `lead.config.php` on the server and fill in real values.
 * `lead.config.php` is gitignored and denied by .htaccess — keep secrets here,
 * never in the committed code.
 *
 * Leave a value empty ('') to disable that channel. If nothing is configured,
 * leads are appended to public/leads.log so they are never lost.
 */
return [
    // Telegram: create a bot via @BotFather, then get your chat id.
    'TELEGRAM_BOT_TOKEN'        => '',
    'TELEGRAM_CHAT_ID'          => '',

    // Generic outbound webhook (CRM / Zapier / Make / n8n).
    'LEAD_WEBHOOK_URL'          => '',

    // Google Sheets via an Apps Script web app URL.
    'GOOGLE_SHEETS_WEBHOOK_URL' => '',
];
