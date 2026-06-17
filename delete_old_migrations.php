<?php
$files = glob('d:/ProgramLaptop/laragon/www/backend-mische/database/migrations/2025_*.php');
$files = array_merge($files, glob('d:/ProgramLaptop/laragon/www/backend-mische/database/migrations/2026_*.php'));

// Do not delete the one we just created
$keep = 'd:/ProgramLaptop/laragon/www/backend-mische/database/migrations/2025_01_01_000000_create_mische_schema.php';

$count = 0;
foreach ($files as $file) {
    if (realpath($file) !== realpath($keep)) {
        unlink($file);
        $count++;
    }
}
echo "Deleted $count files.";
