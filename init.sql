-- MySQL dump 10.13  Distrib 8.2.0, for macos12.6 (x86_64)
--
-- Host: localhost    Database: cms
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('7f13454e-bcfb-4adf-a6aa-2148332d2722','582a8e8f13a71d5f6cd01505e275d39af9cf6ae47507ee4d834c113eb1ffebb8','2024-01-20 04:26:37.896','20240120042635_init',NULL,NULL,'2024-01-20 04:26:35.830',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attendence`
--

DROP TABLE IF EXISTS `Attendence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attendence` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userRefId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `presentCount` int NOT NULL DEFAULT '0',
  `presentDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Attendence_id_userRefId_idx` (`id`,`userRefId`),
  KEY `Attendence_userRefId_fkey` (`userRefId`),
  CONSTRAINT `Attendence_userRefId_fkey` FOREIGN KEY (`userRefId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendence`
--

LOCK TABLES `Attendence` WRITE;
/*!40000 ALTER TABLE `Attendence` DISABLE KEYS */;
/*!40000 ALTER TABLE `Attendence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `departmentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Department_id_departmentName_idx` (`id`,`departmentName`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
INSERT INTO `Department` VALUES (1,'CSIT'),(2,'BCA');
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notice`
--

DROP TABLE IF EXISTS `Notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Notice_title_key` (`title`),
  KEY `Notice_id_title_createdBy_created_at_userId_idx` (`id`,`title`,`createdBy`,`created_at`,`userId`),
  KEY `Notice_userId_fkey` (`userId`),
  CONSTRAINT `Notice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notice`
--

LOCK TABLES `Notice` WRITE;
/*!40000 ALTER TABLE `Notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Otp`
--

DROP TABLE IF EXISTS `Otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `Otp_id_key` (`id`),
  UNIQUE KEY `Otp_key_key` (`key`),
  KEY `Otp_email_userId_key_created_at_idx` (`email`,`userId`,`key`,`created_at`),
  KEY `Otp_userId_fkey` (`userId`),
  CONSTRAINT `Otp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Otp`
--

LOCK TABLES `Otp` WRITE;
/*!40000 ALTER TABLE `Otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `Otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Semester`
--

DROP TABLE IF EXISTS `Semester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Semester` (
  `id` int NOT NULL AUTO_INCREMENT,
  `semesterName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Semester_id_semesterName_idx` (`id`,`semesterName`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Semester`
--

LOCK TABLES `Semester` WRITE;
/*!40000 ALTER TABLE `Semester` DISABLE KEYS */;
INSERT INTO `Semester` VALUES (1,'FIRST'),(2,'SECOND'),(3,'THIRD'),(4,'FOURTH'),(5,'FIFTH'),(6,'SIXTH'),(7,'SEVENTH'),(8,'EIGHTH');
/*!40000 ALTER TABLE `Semester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Staff`
--

DROP TABLE IF EXISTS `Staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Staff` (
  `staffId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`staffId`),
  UNIQUE KEY `Staff_staffId_key` (`staffId`),
  KEY `Staff_staffId_idx` (`staffId`),
  CONSTRAINT `Staff_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Staff`
--

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student`
--

DROP TABLE IF EXISTS `Student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student` (
  `studentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semesterRefId` int NOT NULL DEFAULT '0',
  `registrationNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `symbolNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joinDate` datetime(3) NOT NULL,
  `departmentRefId` int NOT NULL,
  PRIMARY KEY (`studentId`),
  UNIQUE KEY `Student_studentId_key` (`studentId`),
  KEY `Student_studentId_semesterRefId_departmentRefId_symbolNumber_idx` (`studentId`,`semesterRefId`,`departmentRefId`,`symbolNumber`,`registrationNumber`),
  KEY `Student_semesterRefId_fkey` (`semesterRefId`),
  KEY `Student_departmentRefId_fkey` (`departmentRefId`),
  CONSTRAINT `Student_departmentRefId_fkey` FOREIGN KEY (`departmentRefId`) REFERENCES `Department` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Student_semesterRefId_fkey` FOREIGN KEY (`semesterRefId`) REFERENCES `Semester` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Student_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student`
--

LOCK TABLES `Student` WRITE;
/*!40000 ALTER TABLE `Student` DISABLE KEYS */;
/*!40000 ALTER TABLE `Student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StudentSubject`
--

DROP TABLE IF EXISTS `StudentSubject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StudentSubject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentRefId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectRefId` int NOT NULL,
  `marks` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `StudentSubject_id_studentRefId_subjectRefId_idx` (`id`,`studentRefId`,`subjectRefId`),
  KEY `StudentSubject_subjectRefId_fkey` (`subjectRefId`),
  KEY `StudentSubject_studentRefId_fkey` (`studentRefId`),
  CONSTRAINT `StudentSubject_studentRefId_fkey` FOREIGN KEY (`studentRefId`) REFERENCES `Student` (`studentId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentSubject_subjectRefId_fkey` FOREIGN KEY (`subjectRefId`) REFERENCES `Subject` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StudentSubject`
--

LOCK TABLES `StudentSubject` WRITE;
/*!40000 ALTER TABLE `StudentSubject` DISABLE KEYS */;
/*!40000 ALTER TABLE `StudentSubject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subject`
--

DROP TABLE IF EXISTS `Subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subjectName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semesterRefId` int NOT NULL,
  `isElective` tinyint(1) NOT NULL,
  `staffRefId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departmentRefId` int NOT NULL,
  `creditHour` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Subject_subjectCode_key` (`subjectCode`),
  KEY `Subject_id_subjectName_semesterRefId_departmentRefId_idx` (`id`,`subjectName`,`semesterRefId`,`departmentRefId`),
  KEY `Subject_semesterRefId_fkey` (`semesterRefId`),
  KEY `Subject_staffRefId_fkey` (`staffRefId`),
  KEY `Subject_departmentRefId_fkey` (`departmentRefId`),
  CONSTRAINT `Subject_departmentRefId_fkey` FOREIGN KEY (`departmentRefId`) REFERENCES `Department` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Subject_semesterRefId_fkey` FOREIGN KEY (`semesterRefId`) REFERENCES `Semester` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Subject_staffRefId_fkey` FOREIGN KEY (`staffRefId`) REFERENCES `Staff` (`staffId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subject`
--

LOCK TABLES `Subject` WRITE;
/*!40000 ALTER TABLE `Subject` DISABLE KEYS */;
INSERT INTO `Subject` VALUES (1,'Computer Fundamentals & Applications','CACS101',1,0,NULL,2,4),(2,'Society and Technology','CACO102',1,0,NULL,2,3),(3,'English I','CAEN103',1,0,NULL,2,3),(4,'Mathematics I','CAMT104',1,0,NULL,2,3),(5,'Digital Logic','CACS105',1,0,NULL,2,3),(6,'C Programming','CACS151',2,0,NULL,2,4),(7,'Financial Accounting','CAAC152',2,0,NULL,2,3),(8,'English II','CAEN153',2,0,NULL,2,3),(9,'Mathematics II','CAMT154',2,0,NULL,2,3),(10,'Microprocessor and Computer Architecture','CACS155',2,0,NULL,2,3),(11,'Data Structure and Algorithm','CACS201',3,0,NULL,2,3),(12,'Probability and Statistics','CAST202',3,0,NULL,2,3),(13,'System Analysis and Design','CACS203',3,0,NULL,2,3),(14,'OOP in Java','CACS204',3,0,NULL,2,3),(15,'Web Technology','CACS205',3,0,NULL,2,3),(16,'Operating System','CACS251',4,0,NULL,2,3),(17,'Numerical Methods','CACS252',4,0,NULL,2,3),(18,'Software Engineering','CACS253',4,0,NULL,2,3),(19,'Scripting Language','CACS254',4,0,NULL,2,3),(20,'Database Management System','CACS255',4,0,NULL,2,3),(21,'Project I','CAPJ256',4,0,NULL,2,2),(22,'MIS and E-Business','CACS301',5,0,NULL,2,3),(23,'DotNet Technology','CACS302',5,0,NULL,2,3),(24,'Computer Networking','CACS303',5,0,NULL,2,3),(25,'Introduction to Management','CAMG304',5,0,NULL,2,3),(26,'Computer Graphics and Animation','CACS305',5,0,NULL,2,3),(27,'Mobile Programming','CACS351',6,0,NULL,2,3),(28,'Distributed System','CACS352',6,0,NULL,2,3),(29,'Applied Economics','CAEC353',6,0,NULL,2,3),(30,'Advanced Java Programming','CACS354',6,0,NULL,2,3),(31,'Network Programming','CACS355',6,0,NULL,2,3),(32,'Project II','CAPJ356',6,0,NULL,2,2),(33,'Cyber Law and Professional Ethics','CACS401',7,0,NULL,2,3),(34,'Cloud Computing','CACS402',7,0,NULL,2,3),(35,'Internship','CAIN403',7,0,NULL,2,3),(36,'Image Processing','CACS404',7,1,NULL,2,3),(37,'Database Administrator','CACS405',7,1,NULL,2,3),(38,'Network Administration','CACS406',7,1,NULL,2,3),(39,'Advanced Dot Net Technology','CACS408',7,1,NULL,2,3),(40,'E-Governance','CACS409',7,1,NULL,2,3),(41,'Artificial Intelligence','CACS410',7,1,NULL,2,3),(42,'Operations Research','CAOR451',8,0,NULL,2,3),(43,'Project III','CAPJ452',8,0,NULL,2,6),(44,'Database Programming','CACS453',8,1,NULL,2,3),(45,'Geographical Information System','CACS454',8,1,NULL,2,3),(46,'Data Analysis and Visualization','CACS455',8,1,NULL,2,3),(47,'Machine Learning','CACS456',8,1,NULL,2,3),(48,'Multimedia System','CACS457',8,1,NULL,2,3),(49,'Knowledge Engineering','CACS458',8,1,NULL,2,3),(50,'Information Security','CACS459',8,1,NULL,2,3),(51,'Internet of Things','CACS460',8,1,NULL,2,3),(52,'Digital Logic','CSC111',1,0,NULL,1,3),(53,'Mathematics I','MTH112',1,0,NULL,1,3),(54,'Physics','PHY113',1,0,NULL,1,3),(55,'C Programming','CSC110',1,0,NULL,1,3),(56,'Introduction to Information Technology','CSC109',1,0,NULL,1,3),(57,'Discrete Structure','CSC160',2,0,NULL,1,3),(58,'Mathematics II','MTH163',2,0,NULL,1,3),(59,'Object-Oriented Programming','CSC161',2,0,NULL,1,3),(60,'Microprocessor','CSC162',2,0,NULL,1,3),(61,'Statistics I','STA164',2,0,NULL,1,3),(62,'Data Structure and Algorithm','CSC206',3,0,NULL,1,3),(63,'Computer Architecture','CSC208',3,0,NULL,1,3),(64,'Numerical Method','CSC207',3,0,NULL,1,3),(65,'Computer Graphics','CSC209',3,0,NULL,1,3),(66,'Statistics II','STA210',3,0,NULL,1,3),(67,'Theory of Computation','CSC257',4,0,NULL,1,3),(68,'Artificial Intelligence','CSC261',4,0,NULL,1,3),(69,'Computer Networks','CSC258',4,0,NULL,1,3),(70,'Operating Systems','CSC259',4,0,NULL,1,3),(71,'Database Management System','CSC260',4,0,NULL,1,3),(72,'Design and Analysis of Algorithms','CSC314',5,0,NULL,1,3),(73,'System Analysis and Design','CSC315',5,0,NULL,1,3),(74,'Cryptography','CSC316',5,0,NULL,1,3),(75,'Simulation and Modeling','CSC317',5,0,NULL,1,3),(76,'Web Technology','CSC318',5,0,NULL,1,3),(77,'Image Processing','CSC321',5,1,NULL,1,3),(78,'Multimedia Computing','CSC319',5,1,NULL,1,3),(79,'Wireless Networking','CSC320',5,1,NULL,1,3),(80,'Knowledge Management','CSC322',5,1,NULL,1,3),(81,'Society and Ethics in Information Technology','CSC323',5,1,NULL,1,3),(82,'Microprocessor Based Design','CSC324',5,1,NULL,1,3),(83,'Software Engineering','CSC364',6,0,NULL,1,3),(84,'Compiler Design and Construction','CSC365',6,0,NULL,1,3),(85,'E-Governance','CSC366',6,0,NULL,1,3),(86,'NET Centric Computing','CSC367',6,0,NULL,1,3),(87,'Technical Writing','CSC368',6,0,NULL,1,3),(88,'Applied Logic','CSC369',6,1,NULL,1,3),(89,'E-Commerce','CSC370',6,1,NULL,1,3),(90,'Automation and Robotics','CSC371',6,1,NULL,1,3),(91,'Neural Networks','CSC372',6,1,NULL,1,3),(92,'Computer Hardware Design','CSC373',6,1,NULL,1,3),(93,'Cognitive Science','CSC374',6,1,NULL,1,3),(94,'Advanced Java Programming','CSC409',7,0,NULL,1,3),(95,'Data Warehousing and Data Mining','CSC410',7,0,NULL,1,3),(96,'Principles of Management','CSC411',7,0,NULL,1,3),(97,'Project Work','CSC412',7,0,NULL,1,3),(98,'Information Retrieval','CSC413',7,1,NULL,1,3),(99,'Database Administrator','CSC414',7,1,NULL,1,3),(100,'Software Project Management','CSC415',7,1,NULL,1,3),(101,'Network Security','CSC416',7,1,NULL,1,3),(102,'Digital System Design','CSC417',7,1,NULL,1,3),(103,'International Marketing','MGT418',7,1,NULL,1,3),(104,'Advanced Database','CSC461',8,0,NULL,1,3),(105,'Internship','CSC462',8,0,NULL,1,6),(106,'Advanced Networking with IPV6','CSC463',8,1,NULL,1,3),(107,'Distributed Networking','CSC464',8,1,NULL,1,3),(108,'Game Technology','CSC465',8,1,NULL,1,3),(109,'Distributed and Object-Oriented Database','CSC466',8,1,NULL,1,3),(110,'Introduction to Cloud Computing','CSC467',8,1,NULL,1,3),(111,'Geographical Information System','CSC468',8,1,NULL,1,3),(112,'Decision Support System and Expert System','CSC469',8,1,NULL,1,3),(113,'Mobile Application Development','CSC470',8,1,NULL,1,3),(114,'Real-Time Systems','CSC471',8,1,NULL,1,3),(115,'Network and System Administration','CSC472',8,1,NULL,1,3),(116,'Embedded Systems Programming','CSC473',8,1,NULL,1,3),(117,'International Business Management','MGT474',8,1,NULL,1,3);
/*!40000 ALTER TABLE `Subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('STAFF','ADMIN','STUDENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfBirth` datetime(3) NOT NULL,
  `refreshToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `isSuspended` tinyint(1) NOT NULL DEFAULT '1',
  `avatarURL` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_phoneNumber_key` (`phoneNumber`),
  KEY `User_id_role_phoneNumber_email_name_idx` (`id`,`role`,`phoneNumber`,`email`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('clrllokzr0000on9li078rpdf','ADMIN','Admin Admin','itsmeyoursujan@gmail.com','Male','Kathmandu 123','AdminAdmin2023@admin.ambition.edu.np','$2b$10$Di1SuqFvO1hn0MJqp/WW9.E8j5KLB2nB8pFin.Fa25ybzrLkPJonW','2024-01-20 04:59:37.671','2024-01-20 04:59:37.671','9816790446','2001-04-26 00:00:00.000',NULL,NULL,1,0,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-20 10:44:52
