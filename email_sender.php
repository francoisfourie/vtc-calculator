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
require_once 'send-grid\sendgrid-php.php';
// Include the FPDF library files
require_once 'fpdf\fpdf.php';

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
    $pdf_content = str_replace('data:application/pdf;filename=generated.pdf;base64,', '', $pdf_data);
    $pdf_content = base64_decode($pdf_content);

    $subject = "Cost estimates from Velile Tinto Cape";
    $message = "Hi there. Please find attached cost estimates";

    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        exit('Invalid email address');
    }




    // Create a SendGrid mail object
    $email = new \SendGrid\Mail\Mail();
    $email->setFrom("francois.b.fourie@gmail.com", "Francois Fourie");
    $email->setSubject($subject);
    $email->addTo($to);
    $email->setTemplateId("d-fffe17666e704d7084e6ad4b5a972785");
  //  $email->addContent("text/html", "<html><body><h3>www</h3><p>yyyy</p> <br> </body></html>");

    // Attach the PDF
    $email->addAttachment(
        $pdf_content,
        "application/pdf",
        "estimate.pdf",
        "attachment"
    );

    // Send the email using the SendGrid API
    //$sendgrid = new \SendGrid($SENDGRID_API_KEY);
    //TODO REMOVE FOR PROD
    $sendgrid = new \SendGrid($SENDGRID_API_KEY, ['verify_ssl' => false]);
    
    //$sendgrid->client->setCurlOptions([CURLOPT_SSL_VERIFYPEER => false]);
    

    try {
        $response = $sendgrid->send($email);
        if ($response->statusCode() == 202) {
            echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
        } else {
            error_log("SendGrid API Error. Status code: " . $response->statusCode() . ", Response: " . $response->body());
            http_response_code($response->statusCode());
            echo json_encode(['success' => false, 'message' => 'Failed to send email. Status code: ' . $response->statusCode() . ', Response: ' . $response->body()]);
        }
    } catch (Exception $e) {
        error_log('Caught exception: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Caught exception: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    exit('Method Not Allowed');
}
