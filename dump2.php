<?php
$files = glob('d:/ProgramLaptop/laragon/www/backend-mische/database/migrations/2025_*.php');
$files = array_merge($files, glob('d:/ProgramLaptop/laragon/www/backend-mische/database/migrations/2026_*.php'));

$out = "";
foreach ($files as $file) {
    $out .= "--- " . basename($file) . " ---\n";
    $out .= file_get_contents($file) . "\n\n";
}

file_put_contents('C:/Users/Muhammad As Shaff/.gemini/antigravity-ide/brain/282da02b-993e-4ed0-8105-2354c1b7fd32/scratch/all_mig_2.txt', $out);
echo "Done";
