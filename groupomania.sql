-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mar. 19 juil. 2022 à 14:13
-- Version du serveur : 5.7.34
-- Version de PHP : 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `Comments`
--

CREATE TABLE `Comments` (
  `id` int(11) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Likes`
--

CREATE TABLE `Likes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Posts`
--

CREATE TABLE `Posts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `like` int(11) NOT NULL,
  `comment` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Posts`
--

INSERT INTO `Posts` (`id`, `userId`, `content`, `imageURL`, `like`, `comment`, `createdAt`, `updatedAt`) VALUES
(7, 1, 'je suis admin', NULL, 0, 0, '2022-07-19 14:12:18', '2022-07-19 14:12:18');

-- --------------------------------------------------------

--
-- Structure de la table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20220215193046-create-user.js'),
('20220215193725-create-post.js'),
('20220215193901-create-comment.js'),
('20220215194040-create-like.js');

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Users`
--

INSERT INTO `Users` (`id`, `nom`, `prenom`, `email`, `password`, `bio`, `imageUrl`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin', 'admin@test.fr', '$2b$10$puHodXqFscktWuTV0VX34ug8bMcOZOOruW3G3/jIwPvY4bw/3texW', NULL, 'http://localhost:3000/images/default/anonyme.png', 1, '2022-07-19 14:11:45', '2022-07-19 14:11:45');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

--
-- Index pour la table `Likes`
--
ALTER TABLE `Likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

--
-- Index pour la table `Posts`
--
ALTER TABLE `Posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Comments`
--
ALTER TABLE `Comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `Likes`
--
ALTER TABLE `Likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Posts`
--
ALTER TABLE `Posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Comments`
--
ALTER TABLE `Comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`);

--
-- Contraintes pour la table `Likes`
--
ALTER TABLE `Likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`);

--
-- Contraintes pour la table `Posts`
--
ALTER TABLE `Posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
