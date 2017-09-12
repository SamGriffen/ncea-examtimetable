-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 04, 2017 at 01:48 PM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exams`
--

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `exam_id` int(3) UNSIGNED NOT NULL,
  `exam_name` varchar(45) NOT NULL,
  `exam_datetime` datetime NOT NULL,
  `exam_level` int(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `page_id` int(10) UNSIGNED NOT NULL,
  `page_title` varchar(45) NOT NULL,
  `page_description` varchar(125) NOT NULL,
  `page_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`page_id`, `page_title`, `page_description`, `page_name`) VALUES
(1, 'Home', 'View and manage the exams that you are taking.', 'home'),
(2, 'Login', 'Login to the MyExams application', 'login'),
(3, '404: Page not Found', '404: Page not found', '404'),
(4, 'Admin', 'Manage exam data.', 'admin'),
(5, 'Manage Exams', 'Manage your exams on this page', 'manage');

-- --------------------------------------------------------

--
-- Table structure for table `userexams`
--

CREATE TABLE `userexams` (
  `userexam_id` int(3) UNSIGNED NOT NULL,
  `userexam_user` int(3) UNSIGNED NOT NULL,
  `userexam_exam` int(3) UNSIGNED NOT NULL,
  `userexam_room` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(3) UNSIGNED NOT NULL,
  `user_username` varchar(25) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_status` enum('normie','admin') NOT NULL DEFAULT 'normie'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_username`, `user_password`, `user_status`) VALUES
(1, 'Test', '$2y$10$qhJ64CxLcNocsjh/Vk70UuaUcGQulpIKe1PaN09XskXtkaX0b248.', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`exam_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`page_id`);

--
-- Indexes for table `userexams`
--
ALTER TABLE `userexams`
  ADD PRIMARY KEY (`userexam_id`),
  ADD KEY `fk_userexams_users_idx` (`userexam_user`),
  ADD KEY `fk_userexams_exams1_idx` (`userexam_exam`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `exam_id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;
--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `page_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `userexams`
--
ALTER TABLE `userexams`
  MODIFY `userexam_id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `userexams`
--
ALTER TABLE `userexams`
  ADD CONSTRAINT `userexams_ibfk_1` FOREIGN KEY (`userexam_exam`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userexams_ibfk_2` FOREIGN KEY (`userexam_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
