<?php
$ch = curl_init('https://api.rajaongkir.com/starter/city');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'key: 35dfbd9b70b5d929b92275baec148c34', // My test key? No, I don't have one. I'll just ask the Komerce API... wait. I have no key.
]);
