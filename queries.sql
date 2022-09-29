CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `LastName` varchar(80) NOT NULL,
  `FirstName` varchar(40) NOT NULL,
  `AM` varchar(40) NOT NULL,
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
  `Date` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


SELECT id, CONCAT(FirstName, " ", LastName), Email, Teacher, Classes FROM students;

DELETE s FROM students s INNER JOIN students s2 WHERE s.LastName=s2.LastName AND s.FirstName=s2.FirstName AND s.Email=s2.Email AND s.id<s2.id;


UPDATE students SET ClassYear="Α' Έτος" WHERE ClassYear="Α' Τάξη";
UPDATE students SET ClassYear="Β' Έτος" WHERE ClassYear="Β' Τάξη";
UPDATE students SET ClassYear="Γ' Έτος" WHERE ClassYear="Γ' Τάξη";
UPDATE students SET ClassYear="Δ' Έτος" WHERE ClassYear="Δ' Τάξη";
UPDATE students SET ClassYear="Α' Έτος Διπλώματος" WHERE ClassYear="Α' Τάξη Διπλώματος";
UPDATE students SET ClassYear="Β' Έτος Διπλώματος" WHERE ClassYear="Β' Τάξη Διπλώματος";