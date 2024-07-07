<?php
// email_sender.php

session_start();

//TODO : UPDATE
$SENDGRID_API_KEY = 'xxxx';


// CSRF Protection
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return the CSRF token when requested
    echo json_encode(['csrf_token' => $_SESSION['csrf_token']]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check CSRF token
    $posted_csrf_token = isset($_POST['csrf_token']) ? $_POST['csrf_token'] : '';
    if (!hash_equals($_SESSION['csrf_token'], $posted_csrf_token)) {
        http_response_code(403);
        exit(json_encode(['success' => false, 'message' => 'CSRF token mismatch']));
    }

    // Rate limiting (example: 5 requests per minute)
    if (!isset($_SESSION['last_email_time'])) {
        $_SESSION['last_email_time'] = time();
        $_SESSION['email_count'] = 1;
    } else {
        if (time() - $_SESSION['last_email_time'] < 60) {
            if ($_SESSION['email_count'] >= 5) {
                http_response_code(429);
                exit('Too many requests');
            }
            $_SESSION['email_count']++;
        } else {
            $_SESSION['last_email_time'] = time();
            $_SESSION['email_count'] = 1;
        }
    }

    // Validate and sanitize inputs
    $to = filter_var($_POST['to'], FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(strip_tags($_POST['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(strip_tags($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
    $image = $_POST['image']; // Base64 image data

    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        exit('Invalid email address');
    }

    // Prepare the email data for SendGrid
    $email_data = [
        "personalizations" => [
            [
                "to" => [
                    ["email" => $to]
                ]
            ]
        ],
        "from" => ["email" => "your@email.com", "name" => "Your Name"],
        "subject" => $subject,
        "content" => [
            [
                "type" => "text/html",
                "value" => "<html><body><h1>{$subject}</h1><p>{$message}</p><img src='cid:screenshot' alt='Screen Capture'></body></html>"
            ]
        ],
        "attachments" => [
            [
                "content" => str_replace('data:image/png;base64,', '', $image),
                "type" => "image/png",
                "filename" => "screenshot.png",
                "disposition" => "attachment",
                "content_id" => "screenshot"
            ]
        ]
    ];

    // SendGrid API endpoint
    $url = 'https://api.sendgrid.com/v3/mail/send';
    



// Initialize cURL
$curl = curl_init($url);
//TODO : REMOVE FOR PROD
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($email_data));
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $SENDGRID_API_KEY,
    'Content-Type: application/json'
]);

// Enable error reporting
curl_setopt($curl, CURLOPT_FAILONERROR, true);

// Send the request
$response = curl_exec($curl);
$status_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

if ($response === false) {
    $error_message = curl_error($curl);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'cURL Error: ' . $error_message]);
} else if ($status_code == 202) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Status code: ' . $status_code . ', Response: ' . $response]);
}

curl_close($curl);
} else {
    http_response_code(405);
    exit('Method Not Allowed');
}