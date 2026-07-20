<?php
/**
 * ShoSho Trip — lead intake for static/PHP hosting.
 *
 * Replaces the Node API route (/api/lead) removed for the static export.
 * The site's lead form POSTs JSON here; this forwards the lead to whatever
 * channels are configured (Telegram bot and/or generic webhooks) and answers
 * with JSON ({"ok":true}).
 *
 * Configure secrets in a sibling `lead.config.php` (NOT committed) that returns
 * an array, e.g.:
 *
 *   <?php return [
 *     'TELEGRAM_BOT_TOKEN'        => '123456:ABC...',
 *     'TELEGRAM_CHAT_ID'          => '111111111',
 *     'LEAD_WEBHOOK_URL'          => '',
 *     'GOOGLE_SHEETS_WEBHOOK_URL' => '',
 *   ];
 *
 * Environment variables of the same names are used as a fallback.
 */

header('Content-Type: application/json; charset=utf-8');

// ---- Config -------------------------------------------------------------
$cfg = [];
$cfgFile = __DIR__ . '/lead.config.php';
if (is_file($cfgFile)) {
    $loaded = include $cfgFile;
    if (is_array($loaded)) {
        $cfg = $loaded;
    }
}
function cfg($key)
{
    global $cfg;
    if (!empty($cfg[$key])) {
        return $cfg[$key];
    }
    $env = getenv($key);
    return $env !== false ? $env : '';
}

// ---- Only POST ----------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// ---- Parse body (JSON, with form-encoded fallback) ----------------------
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    $body = $_POST;
}
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad_json']);
    exit;
}

// ---- Honeypot: silently accept, then drop bots --------------------------
if (!empty($body['company']) && trim((string) $body['company']) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// ---- Validation (mirrors validateLead in src/lib/leads.ts) --------------
$name = trim((string) ($body['name'] ?? ''));
$phone = (string) ($body['phone'] ?? '');
$digits = preg_replace('/\D+/', '', $phone);
$consent = !empty($body['consent']);

$errors = [];
if (mb_strlen($name) < 2) {
    $errors[] = 'name';
}
if (mb_strlen($digits) < 9) {
    $errors[] = 'phone';
}
if (!$consent) {
    $errors[] = 'consent';
}
if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

// ---- Build the human-readable message -----------------------------------
function val($body, $key)
{
    return isset($body[$key]) ? trim((string) $body[$key]) : '';
}

$lines = [];
$lines[] = '🧭 ShoSho Trip — нова заявка (' . (val($body, 'source') ?: 'site') . ')';
$lines[] = 'Імʼя: ' . $name;
$lines[] = 'Телефон: ' . $phone;
if (val($body, 'telegram') !== '') {
    $lines[] = 'Telegram: ' . val($body, 'telegram');
}
if (val($body, 'tourName') !== '') {
    $lines[] = 'Тур: ' . val($body, 'tourName');
}
if (val($body, 'tourDate') !== '') {
    $lines[] = 'Дата: ' . val($body, 'tourDate');
}
if (!empty($body['quizAnswers']) && is_array($body['quizAnswers'])) {
    $answers = [];
    foreach (array_values($body['quizAnswers']) as $i => $a) {
        $answers[] = '  ' . ($i + 1) . '. ' . trim((string) $a);
    }
    $lines[] = "Відповіді тесту:\n" . implode("\n", $answers);
}
$lines[] = 'Мова: ' . (val($body, 'locale') ?: 'ua');
if (val($body, 'pageUrl') !== '') {
    $lines[] = 'Сторінка: ' . val($body, 'pageUrl');
}
if (val($body, 'referrer') !== '') {
    $lines[] = 'Referrer: ' . val($body, 'referrer');
}
if (!empty($body['utm']) && is_array($body['utm'])) {
    $utm = [];
    foreach ($body['utm'] as $k => $v) {
        $utm[] = $k . '=' . $v;
    }
    if ($utm) {
        $lines[] = 'UTM: ' . implode(', ', $utm);
    }
}
$lines[] = 'Час: ' . gmdate('c');
$message = implode("\n", $lines);

// ---- Delivery -----------------------------------------------------------
function postJson($url, $payload)
{
    if (!$url) {
        return false;
    }
    $data = json_encode($payload);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $res !== false && $code >= 200 && $code < 300;
    }
    // Fallback without cURL.
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $data,
            'timeout' => 10,
        ],
    ]);
    return @file_get_contents($url, false, $ctx) !== false;
}

$token = cfg('TELEGRAM_BOT_TOKEN');
$chatId = cfg('TELEGRAM_CHAT_ID');
$webhook = cfg('LEAD_WEBHOOK_URL');
$sheets = cfg('GOOGLE_SHEETS_WEBHOOK_URL');

$anyConfigured = ($token && $chatId) || $webhook || $sheets;
$delivered = false;

if ($token && $chatId) {
    $ok = postJson('https://api.telegram.org/bot' . $token . '/sendMessage', [
        'chat_id' => $chatId,
        'text' => $message,
        'disable_web_page_preview' => true,
    ]);
    $delivered = $delivered || $ok;
}
$lead = $body;
unset($lead['company'], $lead['consent']);
$lead['submittedAt'] = gmdate('c');
if ($webhook) {
    $delivered = postJson($webhook, $lead) || $delivered;
}
if ($sheets) {
    $delivered = postJson($sheets, $lead) || $delivered;
}

// Nothing configured yet: don't lose the lead — log to a local file.
if (!$anyConfigured) {
    @file_put_contents(
        __DIR__ . '/leads.log',
        gmdate('c') . ' ' . $message . "\n\n",
        FILE_APPEND | LOCK_EX
    );
    echo json_encode(['ok' => true]);
    exit;
}

if (!$delivered) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'delivery_failed']);
    exit;
}

echo json_encode(['ok' => true]);
