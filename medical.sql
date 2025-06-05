-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 05, 2025 at 06:38 AM
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
-- Database: `medical`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(255) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `admin_photo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_name`, `admin_phone`, `email`, `admin_photo`, `password`, `user_type`) VALUES
(2, 'Mohamed', '123', 'admin@admin.com', NULL, '202cb962ac59075b964b07152d234b70', 1);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `doctor_id` int(255) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `doctor_phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `doctor_specialty` int(255) NOT NULL,
  `doctor_qualifications` varchar(255) NOT NULL,
  `doctor_clinic_address` varchar(255) NOT NULL,
  `from_working_hours` time NOT NULL,
  `to_working_hours` time NOT NULL,
  `doctor_photo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` int(255) NOT NULL,
  `status` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctor_id`, `doctor_name`, `doctor_phone`, `email`, `doctor_specialty`, `doctor_qualifications`, `doctor_clinic_address`, `from_working_hours`, `to_working_hours`, `doctor_photo`, `password`, `user_type`, `status`) VALUES
(1, 'FadDoctor', '123', 'doctor@doctor.com', 1, 'ddd', 'ffff', '07:27:45', '07:21:35', NULL, '202cb962ac59075b964b07152d234b70', 2, 1),
(9, 'Hassan', '0132525100', 'modomdddda2002@gmail.com', 4, 'ddf', 'The Heights Residence Condominium', '15:33:00', '16:42:00', '2efb66b21826191bfc40d613b919cf8bc9dd484c.jpeg', '202cb962ac59075b964b07152d234b70', 2, 2),
(10, 'Mohamed Doma', '0132525100', 'modoma2002@gmail.com', 5, 'AI', 'The Heights Residence Condominium\r\n#Puncak Muzaffar Hang Tuah Jaya, Jalan MH Utama', '18:55:00', '23:55:00', 'WhatsApp Image 2025-04-16 at 12.07.24 PM.jpeg', '202cb962ac59075b964b07152d234b70', 2, 1),
(11, 'Ahmed', '123456', 'ahmed@gmail.com', 5, 'PHD', 'MMU', '18:13:00', '22:13:00', 'QRCode for Doma Techniques.png', '202cb962ac59075b964b07152d234b70', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `patient_id` int(255) NOT NULL,
  `patient_name` varchar(255) NOT NULL,
  `patient_phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `patient_photo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_id`, `patient_name`, `patient_phone`, `email`, `patient_photo`, `password`, `user_type`) VALUES
(1, 'Hassan', '123', 'patient@patient.com', NULL, '202cb962ac59075b964b07152d234b70', 3);

-- --------------------------------------------------------

--
-- Table structure for table `specialty`
--

CREATE TABLE `specialty` (
  `specialty_id` int(255) NOT NULL,
  `specialty_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specialty`
--

INSERT INTO `specialty` (`specialty_id`, `specialty_name`) VALUES
(1, 'General Medicine'),
(2, 'Pediatrics'),
(3, 'Cardiology'),
(4, 'Dermatology'),
(5, 'Neurology'),
(6, 'Orthopedics'),
(7, 'Psychiatry'),
(8, 'Ophthalmology');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`doctor_id`),
  ADD KEY `specialty` (`doctor_specialty`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `specialty`
--
ALTER TABLE `specialty`
  ADD PRIMARY KEY (`specialty_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `doctor_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `patient_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `specialty`
--
ALTER TABLE `specialty`
  MODIFY `specialty_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `doctor`
--
ALTER TABLE `doctor`
  ADD CONSTRAINT `specialty` FOREIGN KEY (`doctor_specialty`) REFERENCES `specialty` (`specialty_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
