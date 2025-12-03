-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 04:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbfuncionalsite`
--

-- --------------------------------------------------------

--
-- Table structure for table `carrinho`
--

CREATE TABLE `carrinho` (
  `idUsuario` int(11) NOT NULL,
  `idProduto` int(11) NOT NULL,
  `quantidadeProduto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carrinho`
--

INSERT INTO `carrinho` (`idUsuario`, `idProduto`, `quantidadeProduto`) VALUES
(2, 1, 1),
(3, 2, 2),
(3, 3, 1),
(4, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `entrega`
--

CREATE TABLE `entrega` (
  `idEntrega` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `statusEntrega` varchar(50) NOT NULL,
  `data_entrega` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `entrega`
--

INSERT INTO `entrega` (`idEntrega`, `idPedido`, `endereco`, `statusEntrega`, `data_entrega`) VALUES
(1, 1, 'Rua das Flores, 123 - São Paulo/SP', 'Entregue', '2025-09-25'),
(2, 2, 'Av. Paulista, 1000 - São Paulo/SP', 'Em Transporte', NULL),
(3, 3, 'Rua do Comércio, 456 - Rio de Janeiro/RJ', 'Aguardando Pagamento', NULL),
(4, 4, 'Rua das Flores, 123 - São Paulo/SP', 'Entregue', '2025-09-20'),
(5, 5, 'Rua Central, 789 - Belo Horizonte/MG', 'Preparando Envio', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pagamento`
--

CREATE TABLE `pagamento` (
  `idPagamento` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `metodo` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `data_pagamento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pagamento`
--

INSERT INTO `pagamento` (`idPagamento`, `idPedido`, `valor`, `metodo`, `status`, `data_pagamento`) VALUES
(1, 1, 3849.80, 'Cartão de Crédito', 'Aprovado', '2025-05-13'),
(2, 2, 949.80, 'PIX', 'Aprovado', '2025-06-10'),
(3, 3, 1899.90, 'Boleto', 'Pendente', '2025-10-01'),
(4, 4, 1499.70, 'Cartão de Crédito', 'Aprovado', '2025-09-09'),
(5, 5, 1299.90, 'PIX', 'Pendente', '2025-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `pedido`
--

CREATE TABLE `pedido` (
  `idPedido` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `metodoPagamento` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `data_pedido` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pedido`
--

INSERT INTO `pedido` (`idPedido`, `idUsuario`, `metodoPagamento`, `status`, `data_pedido`) VALUES
(1, 1, 'Cartão de Crédito', 'Entregue', '2025-10-01'),
(2, 2, 'PIX', 'Em Transporte', '2025-10-01'),
(3, 3, 'Boleto', 'Processando', '2025-10-01'),
(4, 1, 'Cartão de Crédito', 'Entregue', '2025-10-01'),
(5, 4, 'PIX', 'Processando', '2025-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `produto`
--

CREATE TABLE `produto` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `estoque` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produto`
--

INSERT INTO `produto` (`id`, `nome`, `descricao`, `preco`, `imagem`, `estoque`) VALUES
(1, 'Notebook Dell Inspiron', 'Notebook com Intel i5, 8GB RAM, 256GB SSD', 3499.90, 'notebook-dell.jpg', 15),
(2, 'Mouse Logitech MX Master', 'Mouse ergonômico sem fio', 349.90, 'mouse-logitech.jpg', 50),
(3, 'Teclado Mecânico Keychron', 'Teclado mecânico RGB com switches blue', 599.90, 'teclado-keychron.jpg', 30),
(4, 'Monitor LG 27 4K', 'Monitor 27 polegadas 4K UHD', 1899.90, 'monitor-lg.jpg', 20),
(5, 'Webcam Logitech C920', 'Webcam Full HD 1080p', 449.90, 'webcam-logitech.jpg', 40),
(6, 'Headset HyperX Cloud', 'Headset gamer com microfone', 399.90, 'headset-hyperx.jpg', 35),
(7, 'SSD Samsung 1TB', 'SSD NVMe M.2 1TB', 699.90, 'ssd-samsung.jpg', 25),
(8, 'Cadeira Gamer DT3', 'Cadeira ergonômica para escritório', 1299.90, 'cadeira-dt3.jpg', 10);

-- --------------------------------------------------------

--
-- Table structure for table `produtopedido`
--

CREATE TABLE `produtopedido` (
  `idPedido` int(11) NOT NULL,
  `idProduto` int(11) NOT NULL,
  `quantidadeProduto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produtopedido`
--

INSERT INTO `produtopedido` (`idPedido`, `idProduto`, `quantidadeProduto`) VALUES
(1, 1, 1),
(1, 2, 1),
(2, 3, 1),
(2, 5, 1),
(3, 4, 1),
(4, 6, 2),
(4, 7, 1),
(5, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `email`, `senha`, `is_admin`) VALUES
(1, 'Pedreo Silva', 'pedreo.silva@email.com', '$2y$10$MTj2U8Lmp34cvGPsZh/I0Ot.5hb0bC/qj4v5wNNPCT3nRQcggYW1O', 0),
(2, 'Maria Santos', 'maria.santos@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 0),
(3, 'Pedro Oliveira', 'pedro.oliveira@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 0),
(4, 'Ana Costa', 'ana.costa@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 0),
(5, 'Admin Sistema', 'admin@loja.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 1),
(6, 'Leonardo Tristao', 'leozinhozzt@gmail.com', '$2y$10$MlgURSqJIGXP.WqhX4HhoOlhPuqYGn7s4WXEbKVSe88u4jdnV8CfW', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carrinho`
--
ALTER TABLE `carrinho`
  ADD PRIMARY KEY (`idUsuario`,`idProduto`),
  ADD KEY `idProduto` (`idProduto`);

--
-- Indexes for table `entrega`
--
ALTER TABLE `entrega`
  ADD PRIMARY KEY (`idEntrega`),
  ADD UNIQUE KEY `idPedido` (`idPedido`);

--
-- Indexes for table `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`idPagamento`),
  ADD UNIQUE KEY `idPedido` (`idPedido`);

--
-- Indexes for table `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indexes for table `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produtopedido`
--
ALTER TABLE `produtopedido`
  ADD PRIMARY KEY (`idPedido`,`idProduto`),
  ADD KEY `idProduto` (`idProduto`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `entrega`
--
ALTER TABLE `entrega`
  MODIFY `idEntrega` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `idPagamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pedido`
--
ALTER TABLE `pedido`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `produto`
--
ALTER TABLE `produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carrinho`
--
ALTER TABLE `carrinho`
  ADD CONSTRAINT `carrinho_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `carrinho_ibfk_2` FOREIGN KEY (`idProduto`) REFERENCES `produto` (`id`);

--
-- Constraints for table `entrega`
--
ALTER TABLE `entrega`
  ADD CONSTRAINT `entrega_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`);

--
-- Constraints for table `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`);

--
-- Constraints for table `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Constraints for table `produtopedido`
--
ALTER TABLE `produtopedido`
  ADD CONSTRAINT `produtopedido_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`),
  ADD CONSTRAINT `produtopedido_ibfk_2` FOREIGN KEY (`idProduto`) REFERENCES `produto` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
