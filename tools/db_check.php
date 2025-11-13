<?php
header('Content-Type: application/json');

// Use environment variables or fall back to local development values
$dbHost = getenv('MYSQL_ADDON_HOST') ?: getenv('DB_HOST') ?: 'localhost';
$dbUser = getenv('MYSQL_ADDON_USER') ?: getenv('DB_USER') ?: 'admin';
$dbPass = getenv('MYSQL_ADDON_PASSWORD') ?: getenv('DB_PASSWORD') ?: 'admin';
$dbName = getenv('MYSQL_ADDON_DB') ?: getenv('DB_NAME') ?: 'nicekids1';
$dbPort = getenv('MYSQL_ADDON_PORT') ?: getenv('DB_PORT') ?: 3306;

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
