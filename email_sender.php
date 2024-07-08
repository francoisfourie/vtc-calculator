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

// $emailFooter = '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; font-size: 12px; color: #333;">
// <tr>
//   <td style="padding: 10px 0; border-top: 1px solid #cccccc;">
//     <img src="data:image/png;base64,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" alt="Velile Tinto Cape Logo" width="120" style="display: block; margin-bottom: 10px;">
//     <p style="margin: 0;">
//       <strong>Velile Tinto Cape</strong><br>
//       <a href="https://veliletintocape.co.za" style="color: #333; text-decoration: none;">www.veliletintocape.co.za</a><br>
//       Email: <a href="mailto:info@veliletintocape.co.za" style="color: #333; text-decoration: none;">info@veliletintocape.co.za</a><br>
//       Phone: +27 (0)21 123 4567
//     </p>
//   </td>
// </tr>
// <tr>
//   <td style="padding: 10px 0; font-size: 10px; color: #777;">
//     <p style="margin: 0;">
//       © 2024 Velile Tinto Cape. All rights reserved.<br>
//       <a href="https://veliletintocape.co.za/privacy-policy" style="color: #777; text-decoration: none;">Privacy Policy</a> | 
//       <a href="https://veliletintocape.co.za/terms-of-service" style="color: #777; text-decoration: none;">Terms of Service</a>
//     </p>
//   </td>
// </tr>
// </table>';

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
    //$subject = htmlspecialchars(strip_tags($_POST['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
    $subject = "Cost estimates from Velile Tinto Cape";
    $message = "Hi there. Please find attached cost estimates"; //htmlspecialchars(strip_tags($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
    //$message = htmlspecialchars(strip_tags($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    $image = $_POST['image']; // Base64 image data

    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        exit('Invalid email address');
    }

    // Prepare the email data for SendGrid
    // $email_data = [
    //     "personalizations" => [
    //         [
    //             "to" => [
    //                 ["email" => $to]
    //             ]
    //         ]
    //     ],
    //     "from" => ["email" => "your@email.com", "name" => "Your Name"],
    //     "subject" => $subject,
    //     "content" => [
    //         [
    //             "type" => "text/html",
    //             "value" => "<html><body><h1>{$subject}</h1><p>{$message}</p><img src='cid:screenshot' alt='Screen Capture'> <br> {$emailFooter} </body></html>"
    //         ]
    //     ],
    //     "attachments" => [
    //         [
    //             "content" => str_replace('data:image/png;base64,', '', $image),
    //             "type" => "image/png",
    //             "filename" => "screenshot.png",
    //             "disposition" => "attachment",
    //             "content_id" => "screenshot"
    //         ]
    //     ]
    // ];

    // SendGrid API endpoint
    
    
    $url = 'https://api.sendgrid.com/v3/mail/send';
    
    
    $data = [
        'personalizations' => [
            [
                'to' => [
                    ['email' => 'francoisbfourie@gmail.com']
                ]
            ]
        ],
        'from' => ['email' => 'francois.b.fourie@gmail.com'],
        "subject" => $subject,
        // 'content' => [
        //     [
        //         "type" => "text/html",
        //         "value" => "<html><body><h3>{$subject}</h3><p>{$message}</p><img src='cid:costs' alt='Screen Capture'> <br> {$emailFooter} </body></html>"
        //         //"value" => ""
        //     ]
        // ],
        "template_id" => "d-fffe17666e704d7084e6ad4b5a972785",
        "attachments" => [
            [
                "content" => str_replace('data:image/png;base64,', '', $image),
                "type" => "image/png",
                "filename" => "estimateImage.png",
                "disposition" => "attached",
                "content_id" => "estimateImage"
            ]
        ]
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

     

// // Initialize cURL
// $curl = curl_init($url);
// //TODO : REMOVE FOR PROD
// curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($curl, CURLOPT_POST, true);
// curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($email_data));
// curl_setopt($curl, CURLOPT_HTTPHEADER, [
//     'Authorization: Bearer ' . $SENDGRID_API_KEY,
//     'Content-Type: application/json'
// ]);

// // Enable error reporting
// curl_setopt($curl, CURLOPT_FAILONERROR, true);

// Send the request
$response = curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    $error_message = curl_error($ch);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'cURL Error: ' . $error_message]);
} else if ($status_code == 202) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Status code: ' . $status_code . ', Response: ' . $response]);
}

curl_close($ch);
} else {
    http_response_code(405);
    exit('Method Not Allowed');
}