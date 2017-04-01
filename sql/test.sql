/*CREATE DATABASE users;

USE users;*/


CREATE TABLE `users`.`user` (
  id     INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(30) NOT NULL,
  lastName  VARCHAR(40) NOT NULL,
  image longblob NOT NULL,
  pdf longblob
);
