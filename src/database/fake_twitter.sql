-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2024 at 08:42 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fake_twitter`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `twtId` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `twtId`, `username`, `displayName`, `comment`) VALUES
(301, 201, '@pawlicko', 'Miustress Pricilla', 'Yer get what mew deservuurr'),
(302, 201, '@fifthgenhunte', 'Matthew Hunter', 'Sorry for the collateral damage'),
(303, 202, '@fromatodskippingbtoc', 'Scout', 'Maybe you should do your job better huh?'),
(304, 202, '@elementary', 'Engi', 'Typical underqualified worker'),
(305, 202, '@ilikereallybigguns', 'Gunner', 'Should\'ve given them the zipline eh?'),
(306, 202, '@drillemandgrillem', 'Driller', 'When will R&D give me my drilldozer?'),
(307, 203, '@normalguy', 'guy Jhonson', 'RIP'),
(308, 204, '@mostpowerfulgith', 'Vlakiith', 'GET OUT OF MY ROOM'),
(309, 205, '@sisterlysister', 'Sis Gator', 'Get down there!!!'),
(310, 206, '@gorogoromajima', 'Uncle Majima', 'omw to help you Kiryu'),
(311, 206, '@nocash', 'Ichiban', 'Looks likw you\'re in the SSBU sir'),
(312, 208, '@blueeyedhmpb', 'Kabru', 'Hey that\'s our stuff!!!'),
(313, 208, '@ilikefatpeaches', 'Marceline', 'I\'m not eating that'),
(314, 208, '@dragonsandungeons', 'Laios', 'Looks tasty as always'),
(315, 208, '@chucklefuk', 'Chilchuck', 'Aww c\'mon, monsters again?');

-- --------------------------------------------------------

--
-- Table structure for table `isbookmarked`
--

CREATE TABLE `isbookmarked` (
  `bookmark_id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `twtId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `isliked`
--

CREATE TABLE `isliked` (
  `like_id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `twtId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `isliked`
--

INSERT INTO `isliked` (`like_id`, `userId`, `twtId`) VALUES
(1, 111, 201),
(2, 111, 208);

-- --------------------------------------------------------

--
-- Table structure for table `isretweeted`
--

CREATE TABLE `isretweeted` (
  `retweet_id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `twtId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `userId` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`userId`, `username`, `displayName`, `email`, `password`) VALUES
(101, '@test', 'tester', 'test@gmail.com', 'test'),
(102, '@gorlockthebambino', 'Bambino', '', '99999'),
(103, '@shampoo', 'John Shamos', '', '1231265434354'),
(104, '@thebestemployee', 'Mission Control', 'thebestemployee@drg.com', 'rockandstone'),
(105, '@trendieteen', 'Peter', '', 'fsdhtyjhg'),
(107, '@wanderingmonk', 'Mikudrin', '', 'dlfskdm ejwjeiw'),
(108, '@thebraveknight', 'Lil Gator', '', 'ncxbvjsdhfahi'),
(109, '@judgementkazzy', 'Uncle Kaz', '', 'tigerdrop'),
(110, '@thechosenundead', 'Local Knight', '', 'eeeehhhhhhhhhhhh'),
(111, '@dungeondwelver', 'Senshi', '', 'sddjvkuygsfjdsbfjkeysgfd'),
(124, '@q', 'q', 'q@gmail.com', '$2b$10$cMmuLv8H8oefiz5OP.OoC.x546TR18YEk11Av3uN1LKBJj9ZkU5Ji');

-- --------------------------------------------------------

--
-- Table structure for table `tweets`
--

CREATE TABLE `tweets` (
  `twtId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `tweet` text NOT NULL,
  `image` text DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) NOT NULL DEFAULT 0,
  `retweets` int(11) NOT NULL DEFAULT 0,
  `qtweets` int(11) NOT NULL DEFAULT 0,
  `views` int(11) NOT NULL DEFAULT 0,
  `bookmarks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tweets`
--

INSERT INTO `tweets` (`twtId`, `userId`, `tweet`, `image`, `timestamp`, `likes`, `retweets`, `qtweets`, `views`, `bookmarks`) VALUES
(201, 103, 'AAARGH THEY JUST HUNTED MY FAMILY', 'https://i.imgur.com/8iFdqrC.jpeg', '2024-06-29 00:00:00', 100, 50, 25, 1999, 4),
(202, 104, 'Can\'t believe the last batch of new recruits fell into a deep pit', NULL, '2024-06-01 00:00:00', 32, 5, 1, 90, 0),
(203, 105, 'They got Jacob!', 'https://i.imgur.com/Lao46Bc.png', '2024-05-21 00:00:00', 50000, 23300, 5453, 5663422, 12938),
(204, 107, 'I look sooo good 💅💅💅', 'https://i.imgur.com/2fphDuZ.png', '2024-04-30 00:00:00', 375, 123, 54, 6432, 3),
(205, 108, 'Took me an hour to climb up here', 'https://i.imgur.com/g6svT2d.png', '2024-04-17 00:00:00', 2, 1, 0, 5, 1),
(206, 109, 'What have I run into this time...', 'https://i.imgur.com/S1MzYm4.png', '2024-04-09 00:00:00', 45, 3, 0, 300, 19),
(207, 110, '...', NULL, '2024-02-21 00:00:00', 3216, 453, 231, 67329, 324),
(208, 111, 'Cooked a good bunch of treasure bugs', 'https://i.imgur.com/B4sKzKk.jpeg', '2024-02-01 00:00:00', 5, 3, 1, 12, 2),
(209, 107, 'test tweet', NULL, '2024-07-02 00:00:00', 0, 0, 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `twtId` (`twtId`);

--
-- Indexes for table `isbookmarked`
--
ALTER TABLE `isbookmarked`
  ADD PRIMARY KEY (`bookmark_id`),
  ADD UNIQUE KEY `unique_bookmark` (`userId`,`twtId`),
  ADD KEY `fk_bookmark_tweet` (`twtId`);

--
-- Indexes for table `isliked`
--
ALTER TABLE `isliked`
  ADD PRIMARY KEY (`like_id`),
  ADD UNIQUE KEY `unique_like` (`userId`,`twtId`),
  ADD KEY `fk_like_tweet` (`twtId`);

--
-- Indexes for table `isretweeted`
--
ALTER TABLE `isretweeted`
  ADD PRIMARY KEY (`retweet_id`),
  ADD UNIQUE KEY `unique_retweet` (`userId`,`twtId`),
  ADD KEY `fk_retweet_tweet` (`twtId`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `tweets`
--
ALTER TABLE `tweets`
  ADD PRIMARY KEY (`twtId`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=316;

--
-- AUTO_INCREMENT for table `isbookmarked`
--
ALTER TABLE `isbookmarked`
  MODIFY `bookmark_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `isliked`
--
ALTER TABLE `isliked`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `isretweeted`
--
ALTER TABLE `isretweeted`
  MODIFY `retweet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `tweets`
--
ALTER TABLE `tweets`
  MODIFY `twtId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`twtId`) REFERENCES `tweets` (`twtId`);

--
-- Constraints for table `isbookmarked`
--
ALTER TABLE `isbookmarked`
  ADD CONSTRAINT `fk_bookmark_tweet` FOREIGN KEY (`twtId`) REFERENCES `tweets` (`twtId`),
  ADD CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`userId`) REFERENCES `profile` (`userId`);

--
-- Constraints for table `isliked`
--
ALTER TABLE `isliked`
  ADD CONSTRAINT `fk_like_tweet` FOREIGN KEY (`twtId`) REFERENCES `tweets` (`twtId`),
  ADD CONSTRAINT `fk_like_user` FOREIGN KEY (`userId`) REFERENCES `profile` (`userId`);

--
-- Constraints for table `isretweeted`
--
ALTER TABLE `isretweeted`
  ADD CONSTRAINT `fk_retweet_tweet` FOREIGN KEY (`twtId`) REFERENCES `tweets` (`twtId`),
  ADD CONSTRAINT `fk_retweet_user` FOREIGN KEY (`userId`) REFERENCES `profile` (`userId`);

--
-- Constraints for table `tweets`
--
ALTER TABLE `tweets`
  ADD CONSTRAINT `tweets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `profile` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
