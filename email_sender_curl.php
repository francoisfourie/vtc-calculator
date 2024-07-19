<?php
// email_sender.php

session_start();

function loadEnv($path) {
    if(!file_exists($path)) {
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


//TODO : UPDATE
$SENDGRID_API_KEY = getenv('SENDGRID_API_KEY');



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
    $pdf_data = $_POST['pdf'] ?? '';
    $pdf_content = str_replace('data:application/pdf;base64,', '', $pdf_data);

    //$subject = htmlspecialchars(strip_tags($_POST['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
    $subject = "Cost estimates from Velile Tinto Cape - no template";
    $message = "Hi there. Please find attached cost estimates"; //htmlspecialchars(strip_tags($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
    //$message = htmlspecialchars(strip_tags($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    //$image = $_POST['image']; // Base64 image data

    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        exit('Invalid email address');
    }


    // SendGrid API endpoint
    
    
    $url = 'https://api.sendgrid.com/v3/mail/send';
    

$pdf_content = base64_encode($minimal_pdf);

    $data = [
        'personalizations' => [
            [
                'to' => [
                    ['email' => $to]
                ]
            ]
        ],
        'from' => ['email' => 'francois.b.fourie@gmail.com'],
        "subject" => $subject,
        'content' => [
            [
                "type" => "text/html",
                "value" => "<html><body><h3>www</h3><p>xxxx</p> <br> </body></html>"
                //"value" => ""
            ]
        ],
       // "template_id" => "d-fffe17666e704d7084e6ad4b5a972785",
        "attachments" => [
            [
                "content" => base64_encode($pdf_content),
               //"content" => base64_encode("This is a test PDF content"),
                "type" => "application/pdf",
                "filename" => "estimate.pdf",
                "disposition" => "attachment",
                "content_id" => "estimatePDF"
            ]
        ]
        // "attachments" => [
        //     [
        //         "content" => str_replace('data:image/png;base64,', '', $image),
        //         "type" => "image/png",
        //         "filename" => "estimate.png",
        //         "disposition" => "attachment",
        //         "content_id" => "estimateImage"
        //     ]
        //]
    ];
    
    $ch = curl_init($url);
     //TODO : REMOVE FOR PROD
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $SENDGRID_API_KEY,
        'Content-Type: application/json'
    ]);

     

// Send the request
$response = curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    $error_message = curl_error($ch);
    error_log("cURL Error: " . $error_message);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'cURL Error: ' . $error_message]);
} else if ($status_code == 202) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    error_log("SendGrid API Error. Status code: " . $status_code . ", Response: " . $response);
    http_response_code($status_code);
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Status code: ' . $status_code . ', Response: ' . $response]);
}

curl_close($ch);
} else {
    http_response_code(405);
    exit('Method Not Allowed');
}