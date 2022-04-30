-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 18, 2021 lúc 04:36 AM
-- Phiên bản máy phục vụ: 10.4.11-MariaDB
-- Phiên bản PHP: 7.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ketoan_xuanmai`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `connect`
--

DROP TABLE IF EXISTS `connect`;
CREATE TABLE `connect` (
  `id` int(11) NOT NULL,
  `company` varchar(100) CHARACTER SET utf8 NOT NULL,
  `taxcode` varchar(50) CHARACTER SET utf8 NOT NULL,
  `address` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `host` varchar(50) CHARACTER SET utf8 NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 NOT NULL,
  `dataname` varchar(50) CHARACTER SET utf8 NOT NULL,
  `port` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '3306',
  `active` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Đang đổ dữ liệu cho bảng `connect`
--

INSERT INTO `connect` (`id`, `company`, `taxcode`, `address`, `host`, `username`, `password`, `dataname`, `port`, `active`) VALUES
(23, 'DNTN Tin học Xuân Mai ', '0304529821', '118/63 Bạch Đằng, P24, Bình Thạnh - HCM', 'localhost', 'root', 'nghia@tv', 'ketoan_xuanmai', '3306', 0),
(24, 'Công ty KingMinh', '0304529822', '118/63 Bạch Đằng, P24, Bình Thạnh - HCM', 'localhost', 'root', 'nghia@tv', 'ketoan_kingminh', '3306', 0),
(26, 'Công ty Nhất Nam', '0304529823', '118/63 Bạch Đằng, P24, Bình Thạnh - HCM', 'localhost', 'root', 'nghia@tv', 'ketoan_nhatnam', '3306', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `datalist` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0,
  `role` int(11) NOT NULL DEFAULT 1,
  `gender` tinyint(1) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `token` mediumtext DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `email`, `datalist`, `address`, `password`, `admin`, `role`, `gender`, `age`, `dob`, `mobile`, `city`, `image`, `position`, `status`, `token`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Nghĩa ACN', 'Trần Văn Nghĩa', 'nghiatv@gmail.com', 'ketoan_xuanmai;ketoan_kingminh;ketoan_nhatnam', '118/63 Bạch Đằng ,p24,Bình Thạnh - HCM', '$2a$10$/E4TkCoFUEGj2lkr/UrmxuXafULxg.4/QKH2aesj7VlAX5Cz8U58a', 1, 2, 1, 50, '1960-12-13', '0903917963', 'Hồ Chí Minh', '/images/users/User_01.png', 'Software Development', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTU4NTI4NDc0MSwiZXhwIjoxNTg1Mjg4MzQxLCJuYmYiOjE1ODUyODQ3NDEsImp0aSI6InBhSlZCazczcW4zSjloMUIiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.877jGS6mgv8lPZW2ktvvVmO3Y5jfSwnIP3HZLK322_8', 'r3H8CRJdjMQkNCpBwU16lkQILwdxnizaRx3wQLdLbbdmmvS0d20P1lNKCMVY', '2018-03-21 00:43:57', '2020-03-27 19:27:50'),
(5, 'Trọng Thủy', 'Trọng Thủy', '5nghiatv@gmail.com', 'ketoan_xuanmai;ketoan_kingminh;ketoan_nhatnam', '118/63 Bạch Đằng ,p24,Bình Thạnh - HCM', '$2a$10$/E4TkCoFUEGj2lkr/UrmxuXafULxg.4/QKH2aesj7VlAX5Cz8U58a', 0, 1, 1, 0, '1965-02-17', '0903917961', 'HCM', '/images/users/User_14.png', 'Kế toán Quỹ', 1, '', '', '2020-03-26 23:09:26', '2020-04-02 19:24:33'),
(6, 'Trần Vũ Anh', 'Trần Vũ Anh', 'quemuadotnat@gmail.com', 'ketoan_xuanmai;ketoan_kingminh;ketoan_nhatnam', '118/63 Bạch Đằng ,p24,Bình Thạnh - HCM', '$2a$10$/E4TkCoFUEGj2lkr/UrmxuXafULxg.4/QKH2aesj7VlAX5Cz8U58a', 0, 1, 1, 0, '1989-05-18', '0989199523', 'HCM', '/images/users/User_6.jpg', 'Kế toán viên', 1, '', '', '2020-03-26 23:32:21', '2020-04-02 19:16:17'),
(14, 'guest', 'Khách hàng', '123456@gmail.com', 'ketoan_xuanmai;ketoan_kingminh;ketoan_nhatnam', '118/63 Bạch Đằng ,p24,Bình Thạnh - HCM', '$2a$10$/E4TkCoFUEGj2lkr/UrmxuXafULxg.4/QKH2aesj7VlAX5Cz8U58a', 0, 1, 1, 0, '1961-12-14', '0989199523', 'HCM', '/images/users/logo-vuejs.png', 'Kế toán viên', 1, '', '', '2020-03-28 13:36:03', '2020-04-02 19:18:40'),
(17, 'nghiatv1', 'nghiatv1', 'github@gmail.com', '', '', '$2y$10$Y87OIC5JSXpVKq2bxMlsyeA1MuFpm.gJqnbg4GuhK8OQVmaKL8dQi', 0, 1, 0, 0, '0000-00-00', '', '', '', '', 0, 'pREa2AdI9v4UDxGzqkvzKALfh6Rn3m', '', '2020-04-02 21:14:12', '2020-04-02 21:14:12'),
(18, 'nghiatv', 'Trần Văn Nghĩa', 'twitter@gmail.com', '', '', '$2y$10$Oy8n/fV1OOqEAYYXlOqwBOip6HtHIZNgraW0tt0jIvxMsb22/PWwC', 0, 1, 0, 0, '0000-00-00', '', '', '/images/users/User_18.png', '', 0, 'lio2hpo2IQ7CEZLTbYfpRzqKbUu8tZ', '', '2020-04-08 09:04:58', '2020-04-10 19:49:31'),
(40, '5555@gmail.com', '5555@gmail.com', '5555@gmail.com', 'ketoan_xuanmai;ketoan_kingminh;', NULL, '$2a$10$nrcmSYG0S72QC8lA1jiuNOJBbdN1l.ckxI7Fk2t9Fg59OlJMxY7Wi', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(45, '6666', '6666', '6666@gmail.com', '', NULL, '$2a$10$/E4TkCoFUEGj2lkr/UrmxuXafULxg.4/QKH2aesj7VlAX5Cz8U58a', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `connect`
--
ALTER TABLE `connect`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `connect`
--
ALTER TABLE `connect`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
