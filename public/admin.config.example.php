<?php
/**
 * Copy to `admin.config.php` in the same folder on the server and fill in.
 * That file is gitignored and denied by .htaccess — it must never be committed
 * or served.
 *
 * This is set up ONCE, by whoever maintains the site. Editors never see it:
 * they sign in to /admin with a password they choose on their first visit.
 *
 * The token must be a GitHub fine-grained personal access token, limited to
 * this one repository, with "Contents: read and write". It is what lets the
 * panel commit content changes.
 */

return [
    'GITHUB_TOKEN' => '',
    'GITHUB_REPO' => 'loomloomapp-ops/shoshotrip',
    'GITHUB_BRANCH' => 'main',
];
