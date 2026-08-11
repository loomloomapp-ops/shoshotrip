<?php
/**
 * ShoSho Trip — back end for the /admin content panel.
 *
 * The published site is static, so this small PHP endpoint is the only moving
 * part on the hosting. It does two jobs:
 *
 *   1. Authentication. On first visit the editor sets their own password; it is
 *      stored as a bcrypt hash in `admin.auth.php` and checked here. No token,
 *      no account, nothing to remember but the password.
 *
 *   2. A proxy to GitHub. Content lives as JSON in the repository (git is the
 *      store — there is no database), and the API token that writes it stays
 *      here on the server, in `admin.config.php`. The browser never sees it, so
 *      an editor cannot leak it and a stolen laptop does not hand over the
 *      repository.
 *
 * Configure once, in a sibling `admin.config.php` (NOT committed):
 *
 *   <?php return [
 *     'GITHUB_TOKEN'  => 'github_pat_…',   // fine-grained, Contents: read/write
 *     'GITHUB_REPO'   => 'owner/repo',
 *     'GITHUB_BRANCH' => 'main',
 *   ];
 *
 * Both `admin.config.php` and `admin.auth.php` are denied by .htaccess.
 */

declare(strict_types=1);

// Every response here is JSON. A stray notice or deprecation printed by the
// host's PHP version would land inside the body and make it unparseable, so
// diagnostics go to the error log only, never to the client.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const AUTH_FILE = __DIR__ . '/admin.auth.php';
const CONFIG_FILE = __DIR__ . '/admin.config.php';
const LOCKOUT_FILE = __DIR__ . '/admin.lockout.json';

/** Files the panel is allowed to touch. Anything else is rejected outright. */
const ALLOWED_FILES = [
    'tours' => 'src/content/data/tours.json',
    'team' => 'src/content/data/team.json',
    'reviews' => 'src/content/data/reviews.json',
];

const MAX_ATTEMPTS = 8;          // per window, before the door closes
const LOCKOUT_WINDOW = 900;      // 15 minutes
const MAX_UPLOAD_BYTES = 8388608; // 8 MB — well past a sensibly sized photo

function respond(array $body, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): never
{
    respond(['error' => $message], $status);
}

/** Session cookie: same-site, http-only, secure whenever the site is on HTTPS. */
function boot_session(): void
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'secure' => $https,
        'samesite' => 'Strict',
    ]);
    session_name('shosho_admin');
    session_start();
}

function config(): array
{
    if (!is_file(CONFIG_FILE)) {
        fail('Панель ще не налаштована на сервері: немає admin.config.php.', 503);
    }
    $cfg = include CONFIG_FILE;
    if (!is_array($cfg) || empty($cfg['GITHUB_TOKEN']) || empty($cfg['GITHUB_REPO'])) {
        fail('У admin.config.php не заповнено GITHUB_TOKEN або GITHUB_REPO.', 503);
    }
    $cfg['GITHUB_BRANCH'] = $cfg['GITHUB_BRANCH'] ?? 'main';
    return $cfg;
}

function password_is_set(): bool
{
    return is_file(AUTH_FILE);
}

function stored_hash(): ?string
{
    if (!password_is_set()) {
        return null;
    }
    $data = include AUTH_FILE;
    return is_array($data) && !empty($data['hash']) ? (string) $data['hash'] : null;
}

/**
 * Brute-force brake. Shared hosting has no rate limiting of its own, and a
 * single-password door without one is a weekend of guessing away from open.
 */
function attempts(): array
{
    if (!is_file(LOCKOUT_FILE)) {
        return ['count' => 0, 'first' => time()];
    }
    $data = json_decode((string) file_get_contents(LOCKOUT_FILE), true);
    if (!is_array($data) || (time() - ($data['first'] ?? 0)) > LOCKOUT_WINDOW) {
        return ['count' => 0, 'first' => time()];
    }
    return ['count' => (int) $data['count'], 'first' => (int) $data['first']];
}

function record_attempt(bool $success): void
{
    if ($success) {
        @unlink(LOCKOUT_FILE);
        return;
    }
    $a = attempts();
    $a['count']++;
    @file_put_contents(LOCKOUT_FILE, json_encode($a), LOCK_EX);
}

function require_auth(): void
{
    if (empty($_SESSION['admin_ok'])) {
        fail('Потрібно увійти.', 401);
    }
}

/** Single place where this server talks to GitHub. */
function github(string $method, string $path, ?array $payload = null): array
{
    $cfg = config();
    $url = 'https://api.github.com/repos/' . $cfg['GITHUB_REPO'] . '/' . ltrim($path, '/');

    $ch = curl_init($url);
    $headers = [
        'Authorization: Bearer ' . $cfg['GITHUB_TOKEN'],
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: shoshotrip-admin',
    ];
    if ($payload !== null) {
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));
    }
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);

    $raw = curl_exec($ch);
    // curl_close() is a deprecated no-op from PHP 8.0 on and emits a notice on
    // 8.5; the handle is released by the garbage collector instead.
    if ($raw === false) {
        $err = curl_error($ch);
        fail('Немає зв\'язку з GitHub: ' . $err, 502);
    }
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);

    $body = json_decode((string) $raw, true) ?: [];

    if ($status >= 400) {
        $map = [
            401 => 'Токен GitHub у admin.config.php недійсний або прострочений.',
            403 => 'Токен GitHub не має права на запис (потрібно Contents: read and write).',
            404 => 'Не знайдено файл або репозиторій. Перевірте GITHUB_REPO та гілку.',
            409 => 'Дані змінилися паралельно. Перезавантажте сторінку і повторіть правку.',
            422 => 'GitHub відхилив зміну — найімовірніше, файл уже оновили паралельно.',
        ];
        fail($map[$status] ?? ('GitHub: ' . ($body['message'] ?? ('помилка ' . $status))), 502);
    }

    return $body;
}

function resolve_file(string $key): string
{
    if (!isset(ALLOWED_FILES[$key])) {
        fail('Невідомий розділ.', 400);
    }
    return ALLOWED_FILES[$key];
}

/* -------------------------------------------------------------------------- */

boot_session();

$action = $_GET['action'] ?? '';
$input = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawBody = file_get_contents('php://input') ?: '';
    $input = json_decode($rawBody, true) ?: [];
}

switch ($action) {
    /* Lets the panel decide which screen to show: set a password, log in, or work. */
    case 'status':
        respond([
            'configured' => password_is_set(),
            'authed' => !empty($_SESSION['admin_ok']),
            'ready' => is_file(CONFIG_FILE),
        ]);

    /**
     * First run only. Once a password exists this is permanently closed, so a
     * visitor can never overwrite it — which also means the password must be
     * set right after the first deploy, before anyone else finds the page.
     */
    case 'setup':
        if (password_is_set()) {
            fail('Пароль уже встановлено. Скидання — тільки видаленням admin.auth.php на сервері.', 409);
        }
        $password = (string) ($input['password'] ?? '');
        if (strlen($password) < 10) {
            fail('Пароль має бути не коротшим за 10 символів.');
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $php = "<?php return ['hash' => '" . addslashes($hash) . "'];\n";
        if (@file_put_contents(AUTH_FILE, $php, LOCK_EX) === false) {
            fail('Не вдалося зберегти пароль: немає прав на запис у теку сайту.', 500);
        }
        @chmod(AUTH_FILE, 0640);
        session_regenerate_id(true);
        $_SESSION['admin_ok'] = true;
        respond(['ok' => true]);

    case 'login':
        $a = attempts();
        if ($a['count'] >= MAX_ATTEMPTS) {
            fail('Забагато спроб. Спробуйте за 15 хвилин.', 429);
        }
        $hash = stored_hash();
        if ($hash === null) {
            fail('Пароль ще не встановлено.', 409);
        }
        if (!password_verify((string) ($input['password'] ?? ''), $hash)) {
            record_attempt(false);
            fail('Невірний пароль.', 401);
        }
        record_attempt(true);
        session_regenerate_id(true);
        $_SESSION['admin_ok'] = true;
        respond(['ok' => true]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        respond(['ok' => true]);

    case 'load':
        require_auth();
        $cfg = config();
        $path = resolve_file((string) ($_GET['file'] ?? ''));
        $res = github('GET', 'contents/' . $path . '?ref=' . rawurlencode($cfg['GITHUB_BRANCH']));
        respond([
            'data' => json_decode(base64_decode(str_replace("\n", '', $res['content'] ?? '')), true),
            'sha' => $res['sha'] ?? '',
        ]);

    case 'save':
        require_auth();
        $cfg = config();
        $path = resolve_file((string) ($_GET['file'] ?? ''));
        if (!array_key_exists('data', $input) || !is_array($input['data'])) {
            fail('Немає даних для збереження.');
        }
        $json = json_encode(
            $input['data'],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        $res = github('PUT', 'contents/' . $path, [
            'message' => (string) ($input['message'] ?? 'admin: оновлено контент'),
            'content' => base64_encode($json . "\n"),
            'sha' => (string) ($input['sha'] ?? ''),
            'branch' => $cfg['GITHUB_BRANCH'],
        ]);
        respond(['sha' => $res['content']['sha'] ?? '']);

    case 'upload':
        require_auth();
        $cfg = config();
        $name = (string) ($input['name'] ?? '');
        $dataUrl = (string) ($input['content'] ?? '');
        // Reject anything that is not a plain, already-sanitised file name.
        if (!preg_match('/^[a-z0-9][a-z0-9._-]{0,80}$/', $name)) {
            fail('Некоректна назва файлу.');
        }
        $binary = base64_decode($dataUrl, true);
        if ($binary === false || $binary === '') {
            fail('Порожній файл.');
        }
        if (strlen($binary) > MAX_UPLOAD_BYTES) {
            fail('Файл завеликий. Стисніть його до 8 МБ.');
        }
        // Trust the bytes, not the extension: only real images may be stored.
        $info = @getimagesizefromstring($binary);
        if ($info === false) {
            fail('Це не зображення. HEIC із айфона теж не підійде — збережіть як JPEG.');
        }
        github('PUT', 'contents/public/media/uploads/' . $name, [
            'message' => 'admin: upload ' . $name,
            'content' => base64_encode($binary),
            'branch' => $cfg['GITHUB_BRANCH'],
        ]);
        respond(['path' => '/media/uploads/' . $name]);

    default:
        fail('Невідома дія.', 404);
}
