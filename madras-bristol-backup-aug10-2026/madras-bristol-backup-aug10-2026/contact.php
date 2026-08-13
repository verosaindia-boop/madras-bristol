<?php
// Include PHPMailer files
require 'src/PHPMailer.php';
require 'src/SMTP.php';
require 'src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Sanitize inputs
    $name    = htmlspecialchars($_POST['name'] ?? '');
    $email   = htmlspecialchars($_POST['email'] ?? '');
    $phone   = htmlspecialchars($_POST['phone'] ?? '');
    $message = nl2br(htmlspecialchars($_POST['message'] ?? ''));

    // Email body
    $body = "
        <h3>New Contact Form Enquiry</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Message:</strong><br>{$message}</p>
    ";

    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@madrasbristol.com';
        $mail->Password   = 'Madras@2026'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Email setup
        $mail->setFrom('info@madrasbristol.com', 'Madras Bristol');
        $mail->addAddress('booking@madrasbristol.com');
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Message - Madras Bristol";
        $mail->Body    = $body;

        $mail->send();

        echo "<script>
                alert('Thank you! Your message has been sent successfully.');
                window.location.href='contact-us.html';
              </script>";

    } catch (Exception $e) {
        echo "<script>
                alert('Mail not sent. Error: " . addslashes($mail->ErrorInfo) . "');
                window.location.href='contact-us.html';
              </script>";
    }

} else {
    echo 'Invalid request';
}
?>
