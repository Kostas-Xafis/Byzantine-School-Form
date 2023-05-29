CREATE TABLE `books`(
`id` int NOT NULL AUTO_INCREMENT,
`title` varchar(80) NOT NULL,
`author` varchar(80) NOT NULL,
`genre` varchar(40) NOT NULL,
`wholesalePrice` int NOT NULL,
`price` int NOT NULL,
`quantity` int NOT NULL,
`quantitySold` int NOT NULL,
PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
