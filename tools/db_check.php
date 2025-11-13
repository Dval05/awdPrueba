<?php
header('Content-Type: application/json');

// Usar las mismas variables de entorno que database.php
$dbHost = getenv('MYSQL_ADDON_HOST') ?: 'localhost';
$dbUser = getenv('MYSQL_ADDON_USER') ?: 'admin';
$dbPass = getenv('MYSQL_ADDON_PASSWORD') ?: 'admin';
$dbName = getenv('MYSQL_ADDON_DB') ?: 'nicekids1';
$dbPort = getenv('MYSQL_ADDON_PORT') ?: 3306;

$result = ['success' => false];

$mysqli = @new mysqli($dbHost, $dbUser, $dbPass, $dbName, $dbPort);
if ($mysqli->connect_errno) {
    $result['error'] = $mysqli->connect_error;
    $result['errno'] = $mysqli->connect_errno;
} else {
    $result['success'] = true;
    $result['message'] = 'Conectado a MySQL ' . $mysqli->server_info . ' / DB: ' . $dbName;
    // opcional: una consulta simple para confirmar permisos
    $res = $mysqli->query("SELECT 1");
    $result['query_ok'] = $res ? true : false;
    $mysqli->close();
}

echo json_encode($result);
