-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 23 Lis 2020, 01:51
-- Wersja serwera: 10.4.14-MariaDB
-- Wersja PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `cinema`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `genres`
--

CREATE TABLE `genres` (
  `id` int(11) UNSIGNED NOT NULL,
  `genre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Table with all movie genres';

--
-- Zrzut danych tabeli `genres`
--

INSERT INTO `genres` (`id`, `genre`) VALUES
(1, 'nieznany'),
(3, 'przygodowy'),
(4, 'thriller'),
(5, 'obyczajowy'),
(6, 'akcji'),
(7, 'kryminał'),
(8, 'animowany'),
(9, 'komediowy');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `informations`
--

CREATE TABLE `informations` (
  `id` int(11) UNSIGNED NOT NULL COMMENT 'Informations id',
  `name` varchar(40) NOT NULL COMMENT 'Name of information, displayed in select',
  `content` varchar(600) NOT NULL COMMENT 'Information content'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='All additional information, used in e.g. seances';

--
-- Zrzut danych tabeli `informations`
--

INSERT INTO `informations` (`id`, `name`, `content`) VALUES
(1, 'none', ''),
(2, 'Covid - wstrzymanie działalności', 'Drodzy Widzowie,\r\nZgodnie z decyzją Rządu o tymczasowym zawieszeniu działalności instytucji kultury, kina Cineflix będą dalej czynne od 07 listopada 2020 w wersji VoD!.\r\nNie poddajemy się i zamierzamy wytrwać do końca!\r\nTymczasem dbajcie o siebie.');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `movies`
--

CREATE TABLE `movies` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'Primary key',
  `title` varchar(85) NOT NULL COMMENT 'Max 85 chars, information from : https://bit.ly/3oQbOpn',
  `genre` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Movie genre',
  `description` varchar(1500) NOT NULL COMMENT 'Description of movie',
  `trailer` varchar(11) NOT NULL COMMENT 'Contain a youtube video ID',
  `length` smallint(5) UNSIGNED NOT NULL COMMENT 'Movie length in minutes',
  `poster_ext` varchar(5) NOT NULL COMMENT 'Poster file extenstion',
  `release_date` date NOT NULL COMMENT 'Movie release date',
  `added` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'When admin add concrete movie',
  `price` smallint(5) UNSIGNED NOT NULL COMMENT 'Price is assigned directly to the movie. Maybe later foreign key `prices` table'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Movies table contains all available movies in cinema';

--
-- Zrzut danych tabeli `movies`
--

INSERT INTO `movies` (`id`, `title`, `genre`, `description`, `trailer`, `length`, `poster_ext`, `release_date`, `added`, `price`) VALUES
(3, 'Monster Hunter', 3, 'Nasz świat to tylko jeden świat. Gdzieś za nim istnieje inny – świat niebezpiecznych, potężnych potworów, którym rządzą, siejąc śmiertelny strach. Do tego świata zostaje wysłana porucznik Artemis (Milla Jovovich) wraz z elitarną jednostką wyspecjalizowanych żołnierzy. Szokujące uniwersum przeraża. W desperackiej próbie powrotu do naszego świata, odważna porucznik spotyka tajemniczego łowcę (Tony Jaa), którego niezwykłe umiejętności pozwoliły mu przetrwać i zadomowić się w tym potwornym miejscu. Mierząc się z brutalnymi atakami przerażających potworów, wojownicy łączą siły, by odnaleźć drogę do domu. Film na podstawie światowego fenomenu – gry „Monster Hunter”.', '3od-kQMTZ9M', 120, 'jpg', '2020-12-03', '2020-11-13 15:36:48', 26),
(4, 'Śmierć na Nilu', 7, 'Światowej klasy detektyw Hercule Poirot spędza wakacje na Nilu. Zagadkowe morderstwo sprawia, że mężczyzna rozpoczyna śledztwo. W obsadzie same gwiazdy: Kenneth Branagh, Gal Gadot, Armie Hammer, Annette Bening, Emma Mackey, Russell Brand i inni.', 'XuqV0Kp2Mxo', 127, 'jpg', '2020-12-18', '2020-11-13 15:49:18', 20),
(5, 'Wonder Woman 1984', 6, 'Wonder Woman przenosi się w czasie do lat 80. XX wieku. W swojej następnej wielkoekranowej przygodzie stawia czoło dwojgu zupełnie nowym przeciwnikom: Maxowi Lordowi i The Cheetah', 'aBfP-nuBDeM', 151, 'jpg', '2020-11-25', '2020-11-13 15:54:55', 40),
(6, 'Nie czas umierać', 6, 'James Bond opuszcza czynną służbę i cieszy się spokojnym życiem na Jamajce. Tymczasem jednak jego stary przyjaciel Felix Leiter z CIA zwraca się do niego o pomoc. Misja uratowania porwanego naukowca okazuje się o wiele bardziej zdradliwa, niż mogłoby się wydawać i naprowadza agenta 007 na ślad tajemniczego złoczyńcy, dysponującego nową, niezwykle niebezpieczną technologią.\n\n', 'HKatWP5k8Kc', 165, 'jpg', '2020-11-02', '2020-11-13 16:08:34', 35),
(7, 'Co w duszy gra', 8, 'Ale nadchodzi moment, kiedy Joe stwierdza, że jego marzenie może być w zasięgu ręki. Przez jedno nieoczekiwane zdarzenie trafia do fantastycznego miejsca, gdzie zostaje zmuszony, by ponownie zastanowić się nad tym, co to znaczy mieć duszę. Tam spotyka, a ostatecznie również zaprzyjaźnia się z 22 – duszą, która uważa, że życie na Ziemi nie toczy się tak, jak powinno.', 'MnwWxx1J5cM', 120, 'jpg', '2020-11-13', '2020-11-13 17:20:44', 20),
(8, 'Chłopaki z baraków', 9, 'Poznaj mocno zakrapiane i równie pechowe przygody trójki starych znajomych-delikwentów, organizujących swe przekręty w dzielnicy barakowozów w Nowej Szkocji w Kanadzie.', 'ZKaLvJYSj5U', 127, 'jpg', '2001-04-22', '2020-11-14 14:24:01', 15),
(10, 'Czarna wdowa', 6, 'W wyniku niebezpiecznego spisku i podejrzanych powiązań sprzed czasów drużyny Avengers, Natasha Romanoff aka Czarna Wdowa musi skonfrontować się z mrocznymi echami swojej przeszłości. Bohaterka stawia czoła groźnemu, potężnemu przeciwnikowi, który nie cofnie się przed niczym, by ją zniszczyć.', 'zUJpzYETOOM', 120, 'jpg', '2020-11-22', '2020-11-20 22:07:08', 24),
(11, 'Wyprawa do Jungli', 3, 'W Jungle Cruise występują m.in. Dwayne Johnson w roli charyzmatycznego kapitana rzecznego statku i Emily Blunt jako naukowczyni całkowicie pochłonięta pracą badawczą.', 'gT1-YwKGTGM', 120, 'jpg', '2020-11-23', '2020-11-20 23:21:51', 14);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `permissions`
--

CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'Primary key',
  `type` varchar(12) NOT NULL COMMENT 'Account type'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Permissions table contains types of account permissions';

--
-- Zrzut danych tabeli `permissions`
--

INSERT INTO `permissions` (`id`, `type`) VALUES
(0, 'admin'),
(1, 'user'),
(2, 'reserve_only'),
(3, 'email');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservations`
--

CREATE TABLE `reservations` (
  `id` int(10) UNSIGNED ZEROFILL NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `seance` int(10) UNSIGNED NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Reservation Table';

--
-- Zrzut danych tabeli `reservations`
--

INSERT INTO `reservations` (`id`, `user`, `seance`, `date`) VALUES
(0000000001, 2, 3, '2020-11-17 15:50:12'),
(0000000004, 10, 6, '2020-11-19 21:34:01'),
(0000000005, 11, 6, '2020-11-19 21:39:31'),
(0000000006, 5, 6, '2020-11-19 21:47:39'),
(0000000007, 5, 6, '2020-11-19 21:49:03'),
(0000000008, 5, 6, '2020-11-19 21:58:03'),
(0000000009, 12, 6, '2020-11-19 22:17:10'),
(0000000010, 13, 6, '2020-11-19 22:18:49'),
(0000000011, 12, 6, '2020-11-19 22:21:20'),
(0000000012, 13, 6, '2020-11-19 22:25:42'),
(0000000013, 14, 6, '2020-11-19 22:28:42'),
(0000000014, 14, 6, '2020-11-19 22:37:26'),
(0000000015, 12, 6, '2020-11-19 22:47:11'),
(0000000016, 14, 6, '2020-11-19 22:49:29'),
(0000000017, 14, 6, '2020-11-19 22:50:14'),
(0000000018, 14, 6, '2020-11-19 22:51:14'),
(0000000019, 1, 6, '2020-11-19 23:22:52'),
(0000000020, 1, 6, '2020-11-19 23:36:52'),
(0000000021, 1, 6, '2020-11-20 12:32:56'),
(0000000022, 14, 6, '2020-11-20 12:40:03'),
(0000000023, 14, 6, '2020-11-20 12:46:11'),
(0000000024, 12, 7, '2020-11-20 16:18:38'),
(0000000025, 12, 7, '2020-11-20 16:21:01'),
(0000000026, 15, 7, '2020-11-20 17:15:35'),
(0000000027, 10, 9, '2020-11-20 17:56:27'),
(0000000028, 10, 9, '2020-11-20 18:46:16'),
(0000000029, 10, 9, '2020-11-20 18:51:51'),
(0000000030, 10, 9, '2020-11-20 18:54:01'),
(0000000031, 1, 9, '2020-11-20 21:38:06'),
(0000000032, 1, 16, '2020-11-21 21:50:16'),
(0000000033, 1, 10, '2020-11-21 22:18:58'),
(0000000034, 16, 15, '2020-11-21 23:09:32'),
(0000000035, 1, 21, '2020-11-21 23:14:26'),
(0000000036, 17, 21, '2020-11-21 23:15:10'),
(0000000037, 18, 22, '2020-11-21 23:17:17'),
(0000000038, 19, 21, '2020-11-22 01:12:31'),
(0000000039, 20, 21, '2020-11-22 10:57:49'),
(0000000040, 1, 18, '2020-11-22 21:47:30'),
(0000000041, 1, 18, '2020-11-22 21:47:47');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `seances`
--

CREATE TABLE `seances` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'Primary key',
  `movie` int(10) UNSIGNED NOT NULL COMMENT 'Movie id',
  `date` date NOT NULL COMMENT 'Seance date',
  `time` time NOT NULL COMMENT 'Seance time',
  `message` int(10) UNSIGNED NOT NULL COMMENT 'Message stored in another table. Message might be repeated.',
  `price` int(10) UNSIGNED NOT NULL COMMENT 'Each seance might have its own price',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Seanse added'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Seances table contains all movies since creation';

--
-- Zrzut danych tabeli `seances`
--

INSERT INTO `seances` (`id`, `movie`, `date`, `time`, `message`, `price`, `timestamp`) VALUES
(3, 6, '2020-11-17', '12:00:00', 1, 30, '2020-11-15 11:26:53'),
(4, 6, '2020-11-17', '15:00:00', 1, 30, '2020-11-15 11:27:24'),
(5, 6, '2020-11-18', '12:00:00', 2, 35, '2020-11-15 11:27:36'),
(6, 6, '2020-11-20', '16:00:00', 2, 35, '2020-11-18 18:06:51'),
(7, 6, '2020-11-20', '18:30:00', 1, 0, '2020-11-20 12:09:10'),
(8, 6, '2020-11-20', '18:30:00', 1, 0, '2020-11-20 12:09:12'),
(9, 6, '2020-11-21', '12:00:00', 1, 0, '2020-11-20 17:47:53'),
(10, 6, '2020-11-22', '12:00:00', 2, 0, '2020-11-21 12:51:57'),
(11, 8, '2020-11-21', '12:00:00', 1, 0, '2020-11-21 19:29:43'),
(12, 8, '2020-11-22', '09:00:00', 1, 0, '2020-11-21 20:25:58'),
(13, 7, '2020-11-22', '14:50:00', 2, 0, '2020-11-21 20:34:39'),
(14, 8, '2020-11-22', '17:30:00', 2, 0, '2020-11-21 20:40:39'),
(15, 7, '2020-11-22', '19:38:00', 2, 0, '2020-11-21 21:47:32'),
(16, 5, '2020-11-23', '09:00:00', 1, 0, '2020-11-21 21:48:14'),
(17, 5, '2020-11-23', '11:32:00', 1, 0, '2020-11-21 21:48:34'),
(18, 5, '2020-11-23', '14:04:00', 1, 0, '2020-11-21 21:48:48'),
(19, 8, '2020-11-23', '16:36:00', 1, 0, '2020-11-21 22:39:58'),
(20, 11, '2020-11-24', '09:00:00', 2, 0, '2020-11-21 23:12:11'),
(21, 10, '2020-11-24', '11:05:00', 2, 0, '2020-11-21 23:13:16'),
(22, 3, '2020-11-24', '13:10:00', 2, 0, '2020-11-21 23:13:40'),
(23, 8, '2020-11-26', '21:53:00', 1, 0, '2020-11-22 11:28:04'),
(24, 11, '2020-11-26', '19:50:00', 1, 0, '2020-11-22 11:28:51'),
(25, 10, '2020-11-26', '17:45:00', 1, 0, '2020-11-22 11:29:20');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `seats`
--

CREATE TABLE `seats` (
  `id` int(10) UNSIGNED NOT NULL,
  `reservation` int(10) UNSIGNED ZEROFILL NOT NULL,
  `seat` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Seats table, contains all seats on current reservation';

--
-- Zrzut danych tabeli `seats`
--

INSERT INTO `seats` (`id`, `reservation`, `seat`) VALUES
(7, 0000000001, 273),
(8, 0000000001, 272),
(9, 0000000004, 11),
(10, 0000000004, 13),
(11, 0000000004, 31),
(12, 0000000004, 51),
(13, 0000000005, 73),
(14, 0000000005, 74),
(15, 0000000005, 76),
(16, 0000000005, 95),
(17, 0000000005, 114),
(18, 0000000006, 12),
(19, 0000000006, 14),
(20, 0000000006, 32),
(21, 0000000006, 33),
(22, 0000000006, 34),
(23, 0000000007, 53),
(24, 0000000007, 54),
(25, 0000000008, 17),
(26, 0000000008, 37),
(27, 0000000008, 38),
(28, 0000000009, 193),
(29, 0000000009, 213),
(30, 0000000009, 233),
(31, 0000000009, 253),
(32, 0000000010, 15),
(33, 0000000010, 16),
(34, 0000000010, 35),
(35, 0000000010, 36),
(36, 0000000011, 8),
(37, 0000000011, 9),
(38, 0000000011, 10),
(39, 0000000012, 29),
(40, 0000000012, 30),
(41, 0000000012, 49),
(42, 0000000013, 111),
(43, 0000000013, 112),
(44, 0000000013, 131),
(45, 0000000013, 151),
(46, 0000000013, 152),
(47, 0000000014, 52),
(48, 0000000014, 71),
(49, 0000000014, 72),
(50, 0000000015, 209),
(51, 0000000015, 210),
(52, 0000000016, 167),
(53, 0000000016, 168),
(54, 0000000017, 133),
(55, 0000000017, 134),
(56, 0000000018, 91),
(57, 0000000018, 92),
(58, 0000000019, 26),
(59, 0000000019, 27),
(60, 0000000020, 7),
(61, 0000000021, 55),
(62, 0000000021, 56),
(63, 0000000022, 48),
(64, 0000000022, 50),
(65, 0000000023, 174),
(66, 0000000023, 175),
(67, 0000000024, 17),
(68, 0000000024, 37),
(69, 0000000024, 57),
(70, 0000000025, 18),
(71, 0000000025, 38),
(72, 0000000025, 39),
(73, 0000000026, 15),
(74, 0000000026, 16),
(75, 0000000026, 35),
(76, 0000000026, 36),
(77, 0000000027, 11),
(78, 0000000027, 12),
(79, 0000000027, 13),
(80, 0000000028, 211),
(81, 0000000028, 231),
(82, 0000000029, 212),
(83, 0000000029, 213),
(84, 0000000029, 214),
(85, 0000000030, 9),
(86, 0000000030, 10),
(87, 0000000031, 6),
(88, 0000000031, 7),
(89, 0000000032, 66),
(90, 0000000032, 67),
(91, 0000000032, 68),
(92, 0000000032, 69),
(93, 0000000033, 9),
(94, 0000000033, 10),
(95, 0000000033, 11),
(96, 0000000033, 12),
(97, 0000000033, 13),
(98, 0000000033, 14),
(99, 0000000033, 15),
(100, 0000000033, 16),
(101, 0000000034, 90),
(102, 0000000034, 91),
(103, 0000000034, 109),
(104, 0000000034, 110),
(105, 0000000034, 111),
(106, 0000000034, 112),
(107, 0000000035, 93),
(108, 0000000035, 94),
(109, 0000000035, 112),
(110, 0000000035, 113),
(111, 0000000036, 131),
(112, 0000000036, 132),
(113, 0000000036, 133),
(114, 0000000036, 151),
(115, 0000000036, 152),
(116, 0000000036, 153),
(117, 0000000037, 150),
(118, 0000000037, 151),
(119, 0000000037, 152),
(120, 0000000037, 153),
(121, 0000000037, 171),
(122, 0000000037, 172),
(123, 0000000038, 150),
(124, 0000000038, 170),
(125, 0000000038, 171),
(126, 0000000039, 109),
(127, 0000000039, 110),
(128, 0000000039, 111),
(129, 0000000040, 30),
(130, 0000000040, 31),
(131, 0000000040, 32),
(132, 0000000040, 33),
(133, 0000000041, 29),
(134, 0000000041, 49),
(135, 0000000041, 50);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL COMMENT 'Primary key',
  `username` varchar(20) DEFAULT NULL COMMENT 'Username may be null; If null, username is name + surname',
  `name` varchar(13) NOT NULL COMMENT 'It''s necessary',
  `surname` varchar(30) NOT NULL COMMENT 'It''s necessary',
  `password` varchar(255) DEFAULT NULL COMMENT 'If account is registered; Field is hashed by default, so max length it''s not 128 but 255',
  `email` varchar(255) DEFAULT NULL COMMENT 'neccesary if mobile is null or is registered account',
  `mobile` varchar(15) DEFAULT NULL COMMENT 'necessary if email is null',
  `type` int(10) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Necesary',
  `active` tinyint(1) NOT NULL COMMENT 'Is active or smth',
  `joined` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Account joined time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Table of all users (registered or not)';

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `surname`, `password`, `email`, `mobile`, `type`, `active`, `joined`) VALUES
(1, 'admin', 'Jakub', 'Kedra', '$2y$10$qqsPDeiFyhkEdext5ivxL.8o3F8pJ2AzoBTZcBqXHQFaEOjb6IV2W', 'kedra.jakub.szkola@gmail.com', '+48123456789', 0, 1, '0000-00-00 00:00:00'),
(2, 'user', 'Anon', 'Anonimowicz', '$2y$10$0dNi..uBVUjiOQd.jMZMtOqsQ7sds44z5wVtvn1z.6c3GrXC90ebu', 'user@user.com', NULL, 1, 1, '2020-11-05 00:38:28'),
(5, NULL, 'abdul', '', NULL, NULL, '+48997213789', 2, 0, '2020-11-18 23:37:40'),
(8, NULL, 'Siemka', '', NULL, 'ked@gmail.com', NULL, 2, 0, '2020-11-19 14:59:02'),
(9, NULL, 'Antonina', '', NULL, NULL, '+48123123', 2, 0, '2020-11-19 21:00:12'),
(10, NULL, 'Sjemka', '', NULL, NULL, '+489972137234', 2, 0, '2020-11-19 21:04:23'),
(11, NULL, 'Siema byczq', '', NULL, NULL, '+1232137', 2, 0, '2020-11-19 21:39:31'),
(12, NULL, 'Zbigniesz', '', NULL, NULL, '+4899721372', 2, 0, '2020-11-19 22:17:10'),
(13, NULL, 'Zbyszeq', '', NULL, NULL, '+4899721376', 2, 0, '2020-11-19 22:18:49'),
(14, NULL, 'abdul', '', NULL, NULL, '+4899721378', 2, 0, '2020-11-19 22:28:42'),
(15, NULL, 'Mordeczko', '', NULL, NULL, '58514521', 2, 0, '2020-11-20 17:15:35'),
(16, NULL, 'Brat artur', '', NULL, NULL, '+48889234332', 2, 0, '2020-11-21 23:09:32'),
(17, NULL, 'Myszon', '', NULL, NULL, '99123212', 2, 0, '2020-11-21 23:15:10'),
(18, NULL, 'Andrzej', '', NULL, NULL, '+48512612200', 2, 0, '2020-11-21 23:17:17'),
(19, NULL, 'Marian', '', NULL, NULL, '+44434234253', 2, 0, '2020-11-22 01:12:31'),
(20, NULL, 'Tomasz', '', NULL, NULL, '+48234543234', 2, 0, '2020-11-22 10:57:49'),
(21, 'nauczyciel', 'aplikacji', 'serwerowych', '$2y$10$iym.hnPLgxNhaAQdLYa0wuprw6zoyHJ7l8pk2Kj/hWFPm7WT4Gg2q', 'nauczyciel@szkola.pl', NULL, 0, 0, '2020-11-22 14:22:20'),
(22, 'uczen', 'technikum', 'łączności', '$2y$10$7BTGIjk7mIv6Q4Px3Hdm7O6X712lV6Pn42S0gXDq10rmeHA3aApsS', 'uczen@tl.krakow.pl', NULL, 1, 0, '2020-11-22 14:36:33'),
(23, 'xramzes', 'Jakub', 'Kędra', '$2y$10$SssdSHtcz39I1ZPbLY0//uhGS4jzR6iQKP/oh3wQL1SMcNhVZ8ua6', 'contact@xramzes.com', NULL, 1, 0, '2020-11-22 14:37:32'),
(24, 'mariusz123', 'Mariusz', 'Pudzianowski', '$2y$10$9pf0nBnKq9XS36pdnLIOr.47.uaC8hfAl2Uy8.Vpjo7oZGRbSENfC', 'mariusz@pudzian.pl', NULL, 1, 0, '2020-11-22 14:41:56');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `informations`
--
ALTER TABLE `informations`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genre` (`genre`);

--
-- Indeksy dla tabeli `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `Reservation of this seance` (`seance`);

--
-- Indeksy dla tabeli `seances`
--
ALTER TABLE `seances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Movie's seance` (`movie`),
  ADD KEY `Seance information` (`message`);

--
-- Indeksy dla tabeli `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Reservation seats` (`reservation`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `User permissions` (`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT dla tabeli `informations`
--
ALTER TABLE `informations`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Informations id', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT dla tabeli `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT dla tabeli `seances`
--
ALTER TABLE `seances`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT dla tabeli `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=25;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `movies`
--
ALTER TABLE `movies`
  ADD CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`genre`) REFERENCES `genres` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `Reservation of this seance` FOREIGN KEY (`seance`) REFERENCES `seances` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `seances`
--
ALTER TABLE `seances`
  ADD CONSTRAINT `Movie's seance` FOREIGN KEY (`movie`) REFERENCES `movies` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Seance information` FOREIGN KEY (`message`) REFERENCES `informations` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `Reservation seats` FOREIGN KEY (`reservation`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `User permissions` FOREIGN KEY (`type`) REFERENCES `permissions` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
