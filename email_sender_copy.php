<?php
// email_sender.php

session_start();

function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception(".env file not found");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

// Usage
loadEnv(__DIR__ . '/.env');


$SENDGRID_API_KEY = getenv('SENDGRID_API_KEY');

// Include the SendGrid library files
require_once 'send-grid/sendgrid-php.php';
// Include the FPDF library files
//require_once 'fpdf\fpdf.php';

