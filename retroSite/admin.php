<?php
session_start();
require_once 'database/config.php';

// Variável para mensagens
$message = '';
$messageType = '';

// ==================== OPERAÇÕES CRUD ====================

// CREATE - Adicionar novo usuário
if (isset($_POST['action']) && $_POST['action'] === 'create') {
    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = $_POST['senha'];
    $is_admin = isset($_POST['is_admin']) ? (int)$_POST['is_admin'] : 0;
    
    // Validações
    if (empty($nome) || empty($email) || empty($senha)) {
        $message = 'Todos os campos são obrigatórios!';
        $messageType = 'error';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = 'Email inválido!';
        $messageType = 'error';
    } else {
        // Verificar se o email já existe
        $stmt = $conn->prepare("SELECT id FROM usuario WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $message = 'Este email já está cadastrado!';
            $messageType = 'error';
        } else {
            // Hash da senha
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            
            // Inserir usuário
            $stmt = $conn->prepare("INSERT INTO usuario (nome, email, senha, is_admin) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("sssi", $nome, $email, $senha_hash, $is_admin);
            
            if ($stmt->execute()) {
                $message = 'Usuário cadastrado com sucesso!';
                $messageType = 'success';
            } else {
                $message = 'Erro ao cadastrar usuário: ' . $conn->error;
                $messageType = 'error';
            }
        }
        $stmt->close();
    }
}

// UPDATE - Atualizar usuário
if (isset($_POST['action']) && $_POST['action'] === 'update') {
    $id = (int)$_POST['id'];
    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = $_POST['senha'];
    $is_admin = isset($_POST['is_admin']) ? (int)$_POST['is_admin'] : 0;
    
    // Validações
    if (empty($nome) || empty($email)) {
        $message = 'Nome e email são obrigatórios!';
        $messageType = 'error';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = 'Email inválido!';
        $messageType = 'error';
    } else {
        // Verificar se o email já existe em outro usuário
        $stmt = $conn->prepare("SELECT id FROM usuario WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $email, $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $message = 'Este email já está cadastrado em outro usuário!';
            $messageType = 'error';
        } else {
            // Se a senha foi preenchida, atualizar com nova senha
            if (!empty($senha)) {
                $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE usuario SET nome = ?, email = ?, senha = ?, is_admin = ? WHERE id = ?");
                $stmt->bind_param("sssii", $nome, $email, $senha_hash, $is_admin, $id);
            } else {
                // Atualizar sem modificar a senha
                $stmt = $conn->prepare("UPDATE usuario SET nome = ?, email = ?, is_admin = ? WHERE id = ?");
                $stmt->bind_param("ssii", $nome, $email, $is_admin, $id);
            }
            
            if ($stmt->execute()) {
                $message = 'Usuário atualizado com sucesso!';
                $messageType = 'success';
            } else {
                $message = 'Erro ao atualizar usuário: ' . $conn->error;
                $messageType = 'error';
            }
        }
        $stmt->close();
    }
}

// DELETE - Excluir usuário
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    $stmt = $conn->prepare("DELETE FROM usuario WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        $message = 'Usuário excluído com sucesso!';
        $messageType = 'success';
    } else {
        $message = 'Erro ao excluir usuário: ' . $conn->error;
        $messageType = 'error';
    }
    $stmt->close();
    
    // Redirecionar para evitar reenvio do formulário
    header("Location: admin.php?msg=" . urlencode($message) . "&type=" . $messageType);
    exit();
}

// Mensagem de redirecionamento
if (isset($_GET['msg'])) {
    $message = $_GET['msg'];
    $messageType = $_GET['type'];
}

// ==================== BUSCAR DADOS ====================

// Buscar todos os usuários
$usuario_query = "SELECT id, nome, email, is_admin FROM usuario ORDER BY id DESC";
$usuario_result = $conn->query($usuario_query);

// Estatísticas
$total_usuario = $conn->query("SELECT COUNT(*) as total FROM usuario")->fetch_assoc()['total'];
$total_admins = $conn->query("SELECT COUNT(*) as total FROM usuario WHERE is_admin = 1")->fetch_assoc()['total'];
$total_clientes = $conn->query("SELECT COUNT(*) as total FROM usuario WHERE is_admin = 0")->fetch_assoc()['total'];

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FOUR — Painel Administrativo</title>
    <!-- Fonte pixelada -->
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0b0b0b;
            --panel: #0f0f0f;
            --accent-orange: #f28c28;
            --accent-blue: #00a3ff;
            --muted: #d9d9d9;
            --white: #ffffff;
            --card: #111;
            --glass: rgba(255,255,255,0.03);
            --radius: 12px;
            --max-width: 1400px;
            font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: linear-gradient(180deg, #071017 0%, #0b0b0b 100%);
            color: var(--muted);
            line-height: 1.3;
            min-height: 100vh;
            padding: 0;
        }

        h1, h2, h3, .logo {
            font-family: "Press Start 2P", monospace;
            letter-spacing: .5px;
        }

        /* Header Admin */
        .admin-header {
            background: linear-gradient(90deg, rgba(0,0,0,0.45), rgba(255,255,255,0.02));
            border-bottom: 2px solid rgba(255,255,255,0.03);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(6px);
        }

        .admin-header .logo {
            color: var(--accent-orange);
            font-size: 18px;
        }

        .admin-nav {
            display: flex;
            gap: 20px;
        }

        .admin-nav a {
            color: var(--muted);
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 6px;
            transition: all 0.3s;
        }

        .admin-nav a.active, .admin-nav a:hover {
            background: var(--accent-blue);
            color: var(--white);
        }

        .admin-user {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .admin-user img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 2px solid var(--accent-orange);
        }

        /* Layout Principal */
        .admin-container {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 20px;
        }

        /* Sidebar */
        .admin-sidebar {
            background: var(--panel);
            border-radius: var(--radius);
            border: 1px solid rgba(255,255,255,0.03);
            padding: 20px;
            height: fit-content;
            position: sticky;
            top: 20px;
        }

        .admin-sidebar h3 {
            color: var(--accent-orange);
            margin-bottom: 15px;
            font-size: 14px;
        }

        .sidebar-menu {
            list-style: none;
        }

        .sidebar-menu li {
            margin-bottom: 10px;
        }

        .sidebar-menu a {
            color: var(--muted);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 6px;
            transition: all 0.3s;
        }

        .sidebar-menu a:hover, .sidebar-menu a.active {
            background: rgba(255,255,255,0.05);
            color: var(--white);
        }

        .sidebar-menu svg {
            width: 18px;
            height: 18px;
        }

        /* Conteúdo Principal */
        .admin-content {
            background: var(--panel);
            border-radius: var(--radius);
            border: 1px solid rgba(255,255,255,0.03);
            padding: 25px;
        }

        .admin-content h2 {
            color: var(--accent-orange);
            margin-bottom: 20px;
            font-size: 16px;
        }

        /* Cards de Estatísticas */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }

        .stat-card {
            background: var(--card);
            border-radius: var(--radius);
            padding: 15px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.03);
        }

        .stat-card h3 {
            font-size: 12px;
            margin-bottom: 10px;
            color: var(--muted);
        }

        .stat-card .value {
            font-size: 24px;
            font-weight: bold;
            color: var(--accent-blue);
        }

        /* Mensagens de Alerta */
        .alert {
            padding: 15px 20px;
            border-radius: var(--radius);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .alert.success {
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid #4caf50;
            color: #4caf50;
        }

        .alert.error {
            background: rgba(244, 67, 54, 0.2);
            border: 1px solid #f44336;
            color: #f44336;
        }

        /* Tabelas */
        .table-container {
            background: var(--card);
            border-radius: var(--radius);
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.03);
            margin-bottom: 25px;
        }

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: rgba(255,255,255,0.02);
            border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .table-header h3 {
            color: var(--accent-orange);
            font-size: 14px;
        }

        .table-actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 8px 15px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            text-decoration: none;
        }

        .btn-primary {
            background: var(--accent-blue);
            color: var(--white);
        }

        .btn-primary:hover {
            background: #0088cc;
        }

        .btn-secondary {
            background: transparent;
            color: var(--muted);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .btn-secondary:hover {
            background: rgba(255,255,255,0.05);
        }

        .btn-danger {
            background: #f44336;
            color: var(--white);
        }

        .btn-danger:hover {
            background: #d32f2f;
        }

        .btn-success {
            background: #4caf50;
            color: var(--white);
        }

        .btn-success:hover {
            background: #388e3c;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        th {
            background: rgba(255,255,255,0.02);
            color: var(--accent-orange);
            font-size: 12px;
            font-weight: 600;
        }

        td {
            font-size: 13px;
        }

        tr:hover {
            background: rgba(255,255,255,0.02);
        }

        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }

        .status.admin {
            background: rgba(0, 163, 255, 0.2);
            color: #00a3ff;
        }

        .status.cliente {
            background: rgba(242, 140, 40, 0.2);
            color: #f28c28;
        }

        .action-buttons {
            display: flex;
            gap: 5px;
        }

        .btn-small {
            padding: 5px 10px;
            font-size: 12px;
        }

        /* Formulários */
        .form-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .form-modal.active {
            display: flex;
        }

        .form-container {
            background: var(--panel);
            border-radius: var(--radius);
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.03);
        }

        .form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .form-header h3 {
            color: var(--accent-orange);
            font-size: 14px;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--muted);
            font-size: 20px;
            cursor: pointer;
        }

        .form-body {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: var(--muted);
            font-size: 13px;
        }

        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 10px;
            background: var(--glass);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 6px;
            color: var(--white);
            font-size: 13px;
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-row {
            display: flex;
            gap: 15px;
        }

        .form-row .form-group {
            flex: 1;
        }

        .form-footer {
            padding: 20px;
            border-top: 1px solid rgba(255,255,255,0.03);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        /* Responsividade */
        @media (max-width: 1000px) {
            .admin-container {
                grid-template-columns: 1fr;
            }
            
            .admin-sidebar {
                position: static;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 600px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .table-header {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
            
            .form-row {
                flex-direction: column;
                gap: 0;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="admin-header">
        <div class="logo">FOUR ADMIN</div>
        <nav class="admin-nav">
            <a href="admin.php" class="active">Dashboard</a>
            <a href="#">Vendas</a>
            <a href="#">Relatórios</a>
            <a href="#">Configurações</a>
        </nav>
        <div class="admin-user">
            <img src="https://i.pravatar.cc/150?img=5" alt="Admin">
            <span>Admin User</span>
        </div>
    </header>

    <!-- Conteúdo Principal -->
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <h3>Menu Administrativo</h3>
            <ul class="sidebar-menu">
                <li><a href="admin.php" class="active">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    Dashboard
                </a></li>
                <li><a href="#">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    Usuários
                </a></li>
                <li><a href="#">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.9 8.89l-1.05-4.37c-.22-.9-1-1.52-1.91-1.52H5.05c-.9 0-1.69.63-1.9 1.52L2.1 8.89c-.24 1.02-.02 2.06.62 2.83.64.77 1.62 1.19 2.64 1.19h.94l-1.56 5.11c-.16.54.19 1.09.73 1.25.13.04.26.06.39.06.4 0 .77-.25.91-.64l1.86-6.78h8.53l1.86 6.78c.14.39.51.64.91.64.13 0 .26-.02.39-.06.54-.16.89-.71.73-1.25l-1.56-5.11h.94c1.02 0 2-.42 2.64-1.19.64-.77.86-1.81.62-2.83zm-2.44-3.92l.95 3.95c.07.3-.04.57-.25.74-.21.17-.5.19-.75.06l-3.01-1.87-1.47 4.11h-6.3l-1.47-4.11-3.01 1.87c-.25.13-.54.11-.75-.06-.21-.17-.32-.44-.25-.74l.95-3.95h12.36z"/>
                    </svg>
                    Produtos
                </a></li>
                <li><a href="#">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"/>
                    </svg>
                    Pedidos
                </a></li>
                <li><a href="#">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    Relatórios
                </a></li>
                <li><a href="#">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                    </svg>
                    Configurações
                </a></li>
            </ul>
        </aside>

        <!-- Conteúdo Principal -->
        <main class="admin-content">
            <h2>Gerenciamento de Usuários</h2>
            
            <?php if (!empty($message)): ?>
                <div class="alert <?php echo $messageType; ?>">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <?php if ($messageType === 'success'): ?>
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        <?php else: ?>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        <?php endif; ?>
                    </svg>
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>
            
            <!-- Estatísticas -->
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total de Usuários</h3>
                    <div class="value"><?php echo $total_usuario; ?></div>
                </div>
                <div class="stat-card">
                    <h3>Administradores</h3>
                    <div class="value"><?php echo $total_admins; ?></div>
                </div>
                <div class="stat-card">
                    <h3>Clientes</h3>
                    <div class="value"><?php echo $total_clientes; ?></div>
                </div>
            </div>

            <!-- Tabela de Usuários -->
            <div class="table-container">
                <div class="table-header">
                    <h3>Lista de Usuários</h3>
                    <div class="table-actions">
                        <button class="btn btn-primary" onclick="openUserForm()">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Adicionar Usuário
                        </button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($usuario_result->num_rows > 0): ?>
                            <?php while($usuario = $usuario_result->fetch_assoc()): ?>
                                <tr>
                                    <td>#<?php echo str_pad($usuario['id'], 3, '0', STR_PAD_LEFT); ?></td>
                                    <td><?php echo htmlspecialchars($usuario['nome']); ?></td>
                                    <td><?php echo htmlspecialchars($usuario['email']); ?></td>
                                    <td>
                                        <span class="status <?php echo $usuario['is_admin'] ? 'admin' : 'cliente'; ?>">
                                            <?php echo $usuario['is_admin'] ? 'Administrador' : 'Cliente'; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-secondary btn-small" 
                                                    onclick="User(<?php echo $usuario['id']; ?>, '<?php echo htmlspecialchars($usuario['nome'], ENT_QUOTES); ?>', '<?php echo htmlspecialchars($usuario['email'], ENT_QUOTES); ?>', <?php echo $usuario['is_admin']; ?>)">
                                                Editar
                                            </button>
                                            <a href="admin.php?action=delete&id=<?php echo $usuario['id']; ?>" 
                                               class="btn btn-danger btn-small" 
                                               onclick="return confirm('Tem certeza que deseja excluir este usuário?')">
                                                Excluir
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 30px;">
                                    Nenhum usuário cadastrado ainda.
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Modal para Adicionar/Editar Usuário -->
    <div id="userFormModal" class="form-modal">
        <div class="form-container">
            <form method="POST" action="admin.php" id="userForm">
                <input type="hidden" name="action" id="formAction" value="create">
                <input type="hidden" name="id" id="userId" value="">
                
                <div class="form-header">
                    <h3 id="formTitle">Adicionar Novo Usuário</h3>
                    <button type="button" class="close-btn" onclick="closeUserForm()">&times;</button>
                </div>
                
                <div class="form-body">
                    <div class="form-group">
                        <label for="userName">Nome Completo *</label>
                        <input type="text" id="userName" name="nome" placeholder="Digite o nome completo" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userEmail">Email *</label>
                        <input type="email" id="userEmail" name="email" placeholder="Digite o email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userPassword">Senha <span id="passwordHint">(deixe em branco para manter a atual)</span></label>
                        <input type="password" id="userPassword" name="senha" placeholder="Digite a senha">
                    </div>
                    
                    <div class="form-group">
                        <label for="userType">Tipo de Usuário *</label>
                        <select id="userType" name="is_admin" required>
                            <option value="0">Cliente</option>
                            <option value="1">Administrador</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeUserForm()">Cancelar</button>
                    <button type="submit" class="btn btn-success">Salvar Usuário</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Funções para abrir e fechar o modal
        function openUserForm() {
            document.getElementById('userFormModal').classList.add('active');
            document.getElementById('formTitle').textContent = 'Adicionar Novo Usuário';
            document.getElementById('formAction').value = 'create';
            document.getElementById('userId').value = '';
            document.getElementById('userForm').reset();
            document.getElementById('passwordHint').style.display = 'none';
            document.getElementById('userPassword').required = true;
        }
        
        function closeUserForm() {
            document.getElementById('userFormModal').classList.remove('active');
            document.getElementById('userForm').reset();
        }
        
        function User(id, nome, email, isAdmin) {
            document.getElementById('userFormModal').classList.add('active');
            document.getElementById('formTitle').textContent = 'Editar Usuário';
            document.getElementById('formAction').value = 'update';
            document.getElementById('userId').value = id;
            document.getElementById('userName').value = nome;
            document.getElementById('userEmail').value = email;
            document.getElementById('userType').value = isAdmin;
            document.getElementById('userPassword').value = '';
            document.getElementById('passwordHint').style.display = 'inline';
            document.getElementById('userPassword').required = false;
        }
        
        // Fechar modal ao clicar fora dele
        window.onclick = function(event) {
            const userModal = document.getElementById('userFormModal');
            
            if (event.target === userModal) {
                closeUserForm();
            }
        }
        
        // Auto-fechar mensagens de alerta após 5 segundos
        setTimeout(function() {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.style.animation = 'slideDown 0.3s ease reverse';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    </script>
</body>
</html>