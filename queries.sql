-- DB SCHEMA

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
    `Date` varchar(40) NOT NULL,PRIMARY KEY (`id`)) 
ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lessons` (
    `studentId` int NOT NULL,
    `Teacher` varchar(80) NOT NULL,
    `Class` int NOT NULL, 
CONSTRAINT FK_lessons FOREIGN KEY (studentId) REFERENCES students(id))
ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `books`(
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(80) NOT NULL,
    `author` varchar(80) NOT NULL,
    `genre` varchar(40) NOT NULL,
    `wholesalePrice` int NOT NULL,
    `price` int NOT NULL,
    `quantity` int NOT NULL,
    `quantitySold` int NOT NULL,
PRIMARY KEY (`id`))
ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sysUsers` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(80) NOT NULL,
    `password` varchar(80) NOT NULL,
    `session_id` varchar(80),
    `session_exp_date` bigint,
PRIMARY KEY (`id`, `email`)
)ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO sysUsers (email, password) VALUES ('koxafis@gmail.com', 'Whereiswaldo!09');
