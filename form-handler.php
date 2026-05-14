<?php
/**
 * All India Transport - Form Handler
 * Handles contact form and quote form submissions
 * 
 * Configuration: Update the settings below with your actual email address
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

define('ADMIN_EMAIL', 'Info@allindiatransport.in'); // Your email address
define('ADMIN_NAME', 'Bhup Singh');
define('SITE_NAME', 'All India Transport');
define('SITE_URL', 'https://allindiatransport.in/');

// Enable/Disable form submissions
define('ENABLE_CONTACT_FORM', true);
define('ENABLE_QUOTE_FORM', true);

// Email configuration
define('MAIL_FROM', 'Info@allindiatransport.in');
define('MAIL_FROM_NAME', 'All India Transport Website');

// ============================================
// END CONFIGURATION
// ============================================

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// CORS headers (allow from your domain only)
$allowed_domains = array('allindiatransport.in', 'www.allindiatransport.in');
$request_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

foreach ($allowed_domains as $domain) {
    if (strpos($request_origin, $domain) !== false) {
        header('Access-Control-Allow-Origin: ' . $request_origin);
        break;
    }
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$form_type = isset($_POST['form_type']) ? sanitize_input($_POST['form_type']) : '';

// Route to appropriate handler
if ($form_type === 'contact' && ENABLE_CONTACT_FORM) {
    handle_contact_form();
} elseif ($form_type === 'quote' && ENABLE_QUOTE_FORM) {
    handle_quote_form();
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid form type']);
    exit;
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

function handle_contact_form() {
    // Validate required fields
    $required_fields = ['name', 'email', 'phone', 'subject', 'message'];
    $errors = validate_required_fields($required_fields);
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Get and sanitize form data
    $name = sanitize_input($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = sanitize_input($_POST['phone']);
    $subject = sanitize_input($_POST['subject']);
    $message = sanitize_textarea($_POST['message']);
    $company = isset($_POST['company']) ? sanitize_input($_POST['company']) : 'N/A';
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Validate phone
    if (!preg_match('/^[0-9\s\+\-\(\)]+$/', $phone) || strlen($phone) < 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid phone number']);
        exit;
    }
    
    // Create email content
    $email_subject = "New Contact Form Submission - $subject";
    
    $email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1C4F72; color: #fff; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1C4F72; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div>" . htmlspecialchars($name) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email:</div>
                <div><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
            </div>
            
            <div class='field'>
                <div class='label'>Phone:</div>
                <div><a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div>
            </div>
            
            <div class='field'>
                <div class='label'>Company:</div>
                <div>" . htmlspecialchars($company) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Subject:</div>
                <div>" . htmlspecialchars($subject) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Message:</div>
                <div>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
        </div>
        
        <div class='footer'>
            <p>Submitted on: " . date('Y-m-d H:i:s') . "</p>
            <p>IP Address: " . get_client_ip() . "</p>
        </div>
    </div>
</body>
</html>
    ";
    
    // Send email to admin
    $headers = get_email_headers();
    
    if (mail(ADMIN_EMAIL, $email_subject, $email_body, $headers)) {
        // Send confirmation email to user
        send_confirmation_email($email, $name, 'contact');
        
        // Log submission
        log_form_submission('contact', [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject
        ]);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for contacting us. We will get back to you soon!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send message. Please try again later.'
        ]);
    }
    exit;
}

// ============================================
// QUOTE FORM HANDLER
// ============================================

function handle_quote_form() {
    // Validate required fields
    $required_fields = ['name', 'email', 'phone', 'service_type', 'origin', 'destination'];
    $errors = validate_required_fields($required_fields);
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Get and sanitize form data
    $name = sanitize_input($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = sanitize_input($_POST['phone']);
    $company = isset($_POST['company']) ? sanitize_input($_POST['company']) : 'N/A';
    $service_type = sanitize_input($_POST['service_type']);
    $origin = sanitize_input($_POST['origin']);
    $destination = sanitize_input($_POST['destination']);
    $weight = isset($_POST['weight']) ? sanitize_input($_POST['weight']) : 'Not specified';
    $goods_type = isset($_POST['goods_type']) ? sanitize_input($_POST['goods_type']) : 'Not specified';
    $delivery_date = isset($_POST['delivery_date']) ? sanitize_input($_POST['delivery_date']) : 'Not specified';
    $special_requirements = isset($_POST['special_requirements']) ? sanitize_textarea($_POST['special_requirements']) : 'None';
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Validate phone
    if (!preg_match('/^[0-9\s\+\-\(\)]+$/', $phone) || strlen($phone) < 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid phone number']);
        exit;
    }
    
    // Create email content
    $email_subject = "New Quote Request - $service_type - $origin to $destination";
    
    $email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F7931E; color: #fff; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1C4F72; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .highlight { background: #fffbea; padding: 15px; border-left: 4px solid #F7931E; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Quote Request</h2>
        </div>
        
        <div class='content'>
            <div class='highlight'>
                <strong>Quote Details:</strong><br/>
                From: " . htmlspecialchars($origin) . "<br/>
                To: " . htmlspecialchars($destination) . "<br/>
                Service: " . htmlspecialchars($service_type) . "
            </div>
            
            <div class='field'>
                <div class='label'>Customer Name:</div>
                <div>" . htmlspecialchars($name) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Company:</div>
                <div>" . htmlspecialchars($company) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email:</div>
                <div><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
            </div>
            
            <div class='field'>
                <div class='label'>Phone:</div>
                <div><a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div>
            </div>
            
            <div class='field'>
                <div class='label'>Weight/Volume:</div>
                <div>" . htmlspecialchars($weight) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Type of Goods:</div>
                <div>" . htmlspecialchars($goods_type) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Preferred Delivery Date:</div>
                <div>" . htmlspecialchars($delivery_date) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Special Requirements:</div>
                <div>" . nl2br(htmlspecialchars($special_requirements)) . "</div>
            </div>
        </div>
        
        <div class='footer'>
            <p>Submitted on: " . date('Y-m-d H:i:s') . "</p>
            <p>IP Address: " . get_client_ip() . "</p>
        </div>
    </div>
</body>
</html>
    ";
    
    // Send email to admin
    $headers = get_email_headers();
    
    if (mail(ADMIN_EMAIL, $email_subject, $email_body, $headers)) {
        // Send confirmation email to user
        send_confirmation_email($email, $name, 'quote');
        
        // Log submission
        log_form_submission('quote', [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'service_type' => $service_type,
            'origin' => $origin,
            'destination' => $destination
        ]);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your quote request. Our team will contact you soon with a detailed quote!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send quote request. Please try again later.'
        ]);
    }
    exit;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Sanitize text input
 */
function sanitize_input($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}

/**
 * Sanitize email input
 */
function sanitize_email($email) {
    $email = trim($email);
    $email = strtolower($email);
    $email = htmlspecialchars($email);
    return $email;
}

/**
 * Sanitize textarea input
 */
function sanitize_textarea($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    // Allow line breaks
    $input = str_replace(['&#13;&#10;', '&#10;'], '\n', $input);
    return $input;
}

/**
 * Validate required fields
 */
function validate_required_fields($fields) {
    $errors = [];
    
    foreach ($fields as $field) {
        if (empty($_POST[$field]) || strlen(trim($_POST[$field])) === 0) {
            $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
        }
    }
    
    return $errors;
}

/**
 * Get email headers
 */
function get_email_headers() {
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
    $headers .= "Reply-To: " . MAIL_FROM . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    return $headers;
}

/**
 * Send confirmation email to user
 */
function send_confirmation_email($user_email, $user_name, $form_type) {
    $subject = "Confirmation - " . SITE_NAME;
    
    if ($form_type === 'contact') {
        $message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1C4F72; color: #fff; padding: 20px; border-radius: 5px; }
        h2 { color: #fff; margin: 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Thank You for Contacting Us!</h2>
        </div>
        
        <p>Dear " . htmlspecialchars($user_name) . ",</p>
        
        <p>We have received your contact form submission and appreciate you reaching out to " . SITE_NAME . ".</p>
        
        <p>Our team will review your message and get back to you as soon as possible, typically within 24-48 business hours.</p>
        
        <p><strong>In the meantime:</strong></p>
        <ul>
            <li>If you have any urgent matters, please call us directly</li>
            <li>Check out our <a href='" . SITE_URL . "services.html'>services page</a> for more information</li>
            <li>Visit our <a href='" . SITE_URL . "about.html'>about page</a> to learn more about us</li>
        </ul>
        
        <p>Best regards,<br/>
        <strong>" . SITE_NAME . "</strong></p>
    </div>
</body>
</html>
        ";
    } else {
        $message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F7931E; color: #fff; padding: 20px; border-radius: 5px; }
        h2 { color: #fff; margin: 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Quote Request Received!</h2>
        </div>
        
        <p>Dear " . htmlspecialchars($user_name) . ",</p>
        
        <p>Thank you for requesting a quote from " . SITE_NAME . "!</p>
        
        <p>We have successfully received your quote request and our logistics team is now reviewing the details.</p>
        
        <p><strong>What happens next:</strong></p>
        <ul>
            <li>Our team will analyze your requirements</li>
            <li>We will prepare a detailed quote tailored to your needs</li>
            <li>You will receive the quote via email within 24 hours</li>
            <li>Our team may contact you if we need any clarifications</li>
        </ul>
        
        <p><strong>Need immediate assistance?</strong></p>
        <p>Feel free to <a href='" . SITE_URL . "contact.html'>contact us directly</a> or call our customer service team.</p>
        
        <p>Best regards,<br/>
        <strong>" . SITE_NAME . "</strong></p>
    </div>
</body>
</html>
        ";
    }
    
    $headers = get_email_headers();
    mail($user_email, $subject, $message, $headers);
}

/**
 * Get client IP address
 */
function get_client_ip() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'Unknown';
}

/**
 * Log form submission
 */
function log_form_submission($form_type, $data) {
    $log_dir = dirname(__FILE__) . '/logs';
    
    // Create logs directory if it doesn't exist
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    $log_file = $log_dir . '/form_submissions.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[" . $timestamp . "] Form Type: " . $form_type . " | Data: " . json_encode($data) . "\n";
    
    error_log($log_entry, 3, $log_file);
}

?>
