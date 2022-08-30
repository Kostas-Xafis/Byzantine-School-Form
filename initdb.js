CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `LastName` varchar(80) NOT NULL,
  `FirstName` varchar(40) NOT NULL,
  `AM` varchar(10) NOT NULL,
  `FatherName` varchar(40) NOT NULL,
  `BirthYear` int NOT NULL,
  `Road` varchar(80) NOT NULL,
  `Number` int NOT NULL,
  `TK` int NOT NULL,
  `Region` varchar(80) NOT NULL,
  `Telephone` varchar(20) NOT NULL,
  `Cellphone` varchar(20) NOT NULL,
  `Email` varchar(40) NOT NULL,
  `RegistrationYear` varchar(40) NOT NULL,
  `ClassYear` varchar(40) NOT NULL,
  `Teacher` varchar(80) NOT NULL,
  `Classes` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
