CREATE TABLE `books`(
`id` int NOT NULL AUTO_INCREMENT,
`Title` varchar(80) NOT NULL,
`Author` varchar(80) NOT NULL,
`Genre` varchar(40) NOT NULL,
`WholesalePrice` int NOT NULL,
`Price` int NOT NULL,
`Quantity` int NOT NULL,
`QuantitySold` int NOT NULL,
`Description` varchar(200) NOT NULL,
PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
