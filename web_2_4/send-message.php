<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'Vedansh@vedanshtembhreportfolio.com';
    $mail->Password   = 'YOUR_EMAIL_PASSWORD'; // ⛔ Replace this securely
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('Vedansh@vedanshtembhreportfolio.com', 'Vedansh Portfolio');
    $mail->addAddress('Vedansh@vedanshtembhreportfolio.com');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Message from Portfolio';
    $mail->Body    = '
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> ' . htmlspecialchars($_POST['name']) . '</p>
        <p><strong>Email:</strong> ' . htmlspecialchars($_POST['email']) . '</p>
        <p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($_POST['message'])) . '</p>
    ';

    $mail->send();
    echo 'success';
} catch (Exception $e) {
    echo 'Mailer Error: ' . $mail->ErrorInfo;
}
?>
