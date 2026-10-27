<?php
/* Formularz kontaktowy strony Metafora Architekci – wysyła wiadomość na adres pracowni */
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
if (!empty($_POST['www'])) { echo '{"ok":true}'; exit; } /* pułapka na boty */
$clean = function ($v, $max) { $v = trim(strip_tags((string)$v)); $v = str_replace(["\r", "\n"], ' ', $v); return mb_substr($v, 0, $max); };
$name  = $clean($_POST['name'] ?? '', 120);
$tel   = $clean($_POST['tel'] ?? '', 40);
$place = $clean($_POST['place'] ?? '', 80);
$mail  = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$msg   = mb_substr(trim(strip_tags((string)($_POST['msg'] ?? ''))), 0, 5000);
if (!$name || !$mail || mb_strlen($msg) < 3 || empty($_POST['zgoda'])) { http_response_code(400); echo '{"ok":false,"err":"dane"}'; exit; }
$to = 'gklopocki@me.com';
$subject = '=?UTF-8?B?' . base64_encode('Strona www – zapytanie (' . ($place ?: 'kontakt') . ')') . '?=';
$body = "Miejsce: $place\nImię i nazwisko: $name\nE-mail: $mail\nTelefon: $tel\n\n$msg\n";
$headers = "From: Strona Metafora <no-reply@metaforaarchitekci.pl>\r\nReply-To: $mail\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$ok = @mail($to, $subject, $body, $headers);
echo json_encode(['ok' => (bool)$ok]);
