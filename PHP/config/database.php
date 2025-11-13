<?php
// Database configuration using environment variables
// Falls back to local development values if environment variables are not set

$servername = getenv('MYSQL_ADDON_HOST') ?: getenv('DB_HOST') ?: "localhost";
$username = getenv('MYSQL_ADDON_USER') ?: getenv('DB_USER') ?: "admin";
$password = getenv('MYSQL_ADDON_PASSWORD') ?: getenv('DB_PASSWORD') ?: "admin";
$dbname = getenv('MYSQL_ADDON_DB') ?: getenv('DB_NAME') ?: "nicekids1";
$port = getenv('MYSQL_ADDON_PORT') ?: getenv('DB_PORT') ?: 3306;

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Configurar charset para evitar problemas con caracteres especiales
$conn->set_charset("utf8mb4");

// Verifica conexión
if ($conn->connect_error) {
    // En producción, no mostrar detalles de error
    error_log("Database connection failed: " . $conn->connect_error);
    die("Connection failed. Please check your database configuration.");
}
?>
