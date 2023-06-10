--DROP TABLES;

ALTER TABLE `books` DROP CONSTRAINT `FK_wholesaler`;
--MODIFY TABLE IF EXISTS `lessons` DROP CONSTRAINT `FK_lessons`;

--DROP TABLE IF EXISTS `students`;
--DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `wholesalers`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `repayments`;
DROP TABLE IF EXISTS `sysUsers`;

-- DB SCHEMA;

-- CREATE TABLE `students` (
--     `id` int NOT NULL AUTO_INCREMENT,
--     `LastName` varchar(80) NOT NULL,
--     `FirstName` varchar(40) NOT NULL,
--     `AM` varchar(40) NOT NULL,
--     `FatherName` varchar(40) NOT NULL,
--     `BirthYear` int NOT NULL,
--     `Road` varchar(80) NOT NULL,
--     `Number` int NOT NULL,
--     `TK` int NOT NULL,
--     `Region` varchar(80) NOT NULL,
--     `Telephone` varchar(20) NOT NULL,
--     `Cellphone` varchar(20) NOT NULL,
--     `Email` varchar(40) NOT NULL,
--     `RegistrationYear` varchar(40) NOT NULL,
--     `ClassYear` varchar(40) NOT NULL,
--     `Teacher` varchar(80) NOT NULL,
--     `Classes` int NOT NULL,
--     `Date` varchar(40) NOT NULL,PRIMARY KEY (`id`)) 
-- AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CREATE TABLE `lessons` (
--     `studentId` int NOT NULL,
--     `Teacher` varchar(80) NOT NULL,
--     `Class` int NOT NULL, 
-- CONSTRAINT FK_lessons FOREIGN KEY (studentId) REFERENCES students(id))
-- AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `wholesalers` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(80) NOT NULL,
PRIMARY KEY (`id`))
CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO wholesalers (name) VALUES ('George Orwell');
INSERT INTO wholesalers (name) VALUES ('F. Scott Fitzgerald');
INSERT INTO wholesalers (name) VALUES ('Frances Hodgson Burnett');
INSERT INTO wholesalers (name) VALUES ('Harper Lee');
INSERT INTO wholesalers (name) VALUES ('J.K. Rowling');
INSERT INTO wholesalers (name) VALUES ('Jane Austen');
INSERT INTO wholesalers (name) VALUES ('J.R.R. Tolkien');
INSERT INTO wholesalers (name) VALUES ('J.D. Salinger');
INSERT INTO wholesalers (name) VALUES ('Paulo Coelho');


CREATE TABLE `books`(
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(80) NOT NULL,
    `genre` varchar(40) NOT NULL,
    `wholesalerId` int NOT NULL,
    `wholesalePrice` int NOT NULL,
    `price` int NOT NULL,
    `quantity` int NOT NULL,
    `quantitySold` int NOT NULL,
PRIMARY KEY (`id`),
CONSTRAINT `FK_wholesaler` FOREIGN KEY (wholesalerId) REFERENCES wholesalers(id))
AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("1984", 1, "Dystopian Fiction", 13, 15, 30, 10);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Great Gatsby", 2, "Literary Fiction", 9, 12, 40, 15);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Lord of the Rings", 7, "Epic Fantasy", 20, 25, 45, 24);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Secret Garden", 3, "Children's Literature", 16, 20, 50, 20);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("1984", 1, "Dystopian Fiction", 13, 15, 30, 25);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("To Kill a Mockingbird", 4, "Classic Fiction", 10, 13, 20, 11);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Great Gatsby", 2, "Literary Fiction", 9, 12, 40, 27);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("Harry Potter and the Sorcerer's Stone", 5, "Fantasy", 15, 17, 60, 47);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("Pride and Prejudice", 6, "Romance", 8, 10, 25, 16);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Hobbit", 7, "Fantasy", 12, 15, 35, 12);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Catcher in the Rye", 8, "Coming-of-Age Fiction", 11, 14, 15, 12);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Alchemist", 9, "Philosophical Fiction", 10, 12, 30, 18);
INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES ("The Lord of the Rings", 7, "Epic Fantasy", 20, 25, 45, 23);

CREATE TABLE `payments`(
    `id` int NOT NULL AUTO_INCREMENT,
    `studentName` varchar(80) NOT NULL,
    `amount` int NOT NULL,
    `date` bigint NOT NULL,
PRIMARY KEY (`id`))
CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sysUsers` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(80) NOT NULL,
    `password` varchar(80) NOT NULL,
    `session_id` varchar(80),
    `session_exp_date` bigint,
PRIMARY KEY (`id`, `email`))
AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO sysUsers (email, password) VALUES ('koxafis@gmail.com', 'Whereiswaldo!09');
