<?php
/**
 * Form handler: sends "Оставьте заявку на курс" to Perm.factura@gmail.com
 */

$to = 'Perm.factura@gmail.com';
$subject = 'Заявка на курс — Love & Sew';

// Only handle POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'index.html'));
    exit;
}

// Get and sanitize fields
$name = isset($_POST['name']) ? trim(strip_tags((string) $_POST['name'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags((string) $_POST['phone'])) : '';
$consent = isset($_POST['consent']);

$errors = [];

if ($name === '') {
    $errors[] = 'Имя не указано.';
}
if ($phone === '') {
    $errors[] = 'Номер телефона не указан.';
}
if (!$consent) {
    $errors[] = 'Нет согласия на обработку персональных данных.';
}

if (!empty($errors)) {
    $query = '?' . http_build_query(['sent' => '0', 'error' => implode(' ', $errors)]);
    $back = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'index.html';
    $back = preg_replace('#\?.*$#', '', $back) . $query;
    header('Location: ' . $back);
    exit;
}

$body = "Новая заявка на курс\n\n";
$body .= "Имя: " . $name . "\n";
$body .= "Телефон: " . $phone . "\n";
$body .= "Согласие на обработку данных: да\n";

$headers = [
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

$query = '?' . http_build_query(['sent' => $sent ? '1' : '0']);
$back = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'index.html';
$back = preg_replace('#\?.*$#', '', $back) . $query;
header('Location: ' . $back);
exit;
