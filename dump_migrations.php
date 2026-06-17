<?php
$files = glob('database/migrations/2025_*.php');
$files = array_merge($files, glob('database/migrations/2026_*.php'));

foreach ($files as $file) {
    echo "--- " . basename($file) . " ---\n";
    echo file_get_contents($file) . "\n\n";
}
