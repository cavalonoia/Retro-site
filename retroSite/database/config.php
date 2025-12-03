<?php
// Configurações do banco de dados
$host = 'localhost'; // Host do banco de dados (localhost para ambiente local)
$username = 'root'; // Usuário do banco de dados (padrão do phpMyAdmin é 'root')
$password = ''; // Senha do banco de dados (geralmente vazio no ambiente local)
$dbname = 'dbfuncionalsite'; // Nome do banco de dados

// Criando a conexão
$conn = new mysqli($host, $username, $password, $dbname);

// Definir charset para UTF-8
$conn->set_charset("utf8");

// Verificando a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>