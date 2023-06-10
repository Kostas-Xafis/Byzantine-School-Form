DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(80) NOT NULL,
    `amount` int NOT NULL,
    `date` bigint NOT NULL,
PRIMARY KEY (`id`)
)CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;