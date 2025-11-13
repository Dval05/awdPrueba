<?php
/**
 * Página de información del sistema
 * IMPORTANTE: Eliminar o proteger este archivo en producción
 */

// Verificar si estamos en desarrollo
$isDev = (getenv('MYSQL_ADDON_HOST') === 'localhost' || !getenv('MYSQL_ADDON_HOST'));

if (!$isDev) {
    // En producción, requerir autenticación o deshabilitar
    die('Esta página está deshabilitada en producción');
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Información del Sistema</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .info-box {
            background: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #333;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Información del Sistema - NICEKIDS</h1>
    
    <div class="info-box">
        <h2>Configuración de Base de Datos</h2>
        <table>
            <tr>
                <th>Variable</th>
                <th>Valor</th>
            </tr>
            <tr>
                <td>MYSQL_ADDON_HOST</td>
                <td><?php echo getenv('MYSQL_ADDON_HOST') ?: 'localhost (default)'; ?></td>
            </tr>
            <tr>
                <td>MYSQL_ADDON_DB</td>
                <td><?php echo getenv('MYSQL_ADDON_DB') ?: 'nicekids1 (default)'; ?></td>
            </tr>
            <tr>
                <td>MYSQL_ADDON_USER</td>
                <td><?php echo getenv('MYSQL_ADDON_USER') ?: 'admin (default)'; ?></td>
            </tr>
            <tr>
                <td>MYSQL_ADDON_PASSWORD</td>
                <td><?php echo getenv('MYSQL_ADDON_PASSWORD') ? '***configurado***' : 'admin (default)'; ?></td>
            </tr>
            <tr>
                <td>MYSQL_ADDON_PORT</td>
                <td><?php echo getenv('MYSQL_ADDON_PORT') ?: '3306 (default)'; ?></td>
            </tr>
        </table>
    </div>

    <div class="info-box">
        <h2>Estado de la Conexión</h2>
        <?php
        try {
            require_once(__DIR__ . '/PHP/config/database.php');
            if ($conn) {
                echo '<p class="success">✓ Conexión a base de datos exitosa</p>';
                echo '<p>Charset: ' . $conn->character_set_name() . '</p>';
                
                $result = $conn->query("SELECT DATABASE() as db_name");
                if ($result) {
                    $row = $result->fetch_assoc();
                    echo '<p>Base de datos: ' . htmlspecialchars($row['db_name']) . '</p>';
                    $result->free();
                }
                
                $conn->close();
            }
        } catch (Exception $e) {
            echo '<p class="error">✗ Error de conexión: ' . htmlspecialchars($e->getMessage()) . '</p>';
        }
        ?>
    </div>

    <div class="info-box">
        <h2>Información de PHP</h2>
        <table>
            <tr>
                <td>Versión de PHP</td>
                <td><?php echo phpversion(); ?></td>
            </tr>
            <tr>
                <td>Extensión MySQLi</td>
                <td><?php echo extension_loaded('mysqli') ? '✓ Instalada' : '✗ No instalada'; ?></td>
            </tr>
            <tr>
                <td>Memoria límite</td>
                <td><?php echo ini_get('memory_limit'); ?></td>
            </tr>
            <tr>
                <td>Upload max filesize</td>
                <td><?php echo ini_get('upload_max_filesize'); ?></td>
            </tr>
        </table>
    </div>
</body>
</html>
