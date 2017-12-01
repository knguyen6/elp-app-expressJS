CREATE DATABASE elp;

USE elp;

CREATE TABLE businessInfo ( 
	id                   INT AUTO_INCREMENT,
	name                 VARCHAR(100)  NOT NULL,
	description          VARCHAR(200),
	CONSTRAINT pk_businessinfo_id PRIMARY KEY ( id )
 )
 AUTO_INCREMENT = 100001;

CREATE TABLE userInfo ( 
	id                   INT AUTO_INCREMENT,
	name                 VARCHAR(100)  NOT NULL,
	address              VARCHAR(100)  NOT NULL,
	contact              VARCHAR(100)  NOT NULL,
	crossRegion     	 BOOL  NOT NULL DEFAULT false, 
	CONSTRAINT pk_userinfo_id PRIMARY KEY ( id )
 )
 AUTO_INCREMENT = 20000001;

CREATE TABLE business ( 
	id                   INT AUTO_INCREMENT,
	businessInfoId       INT NOT NULL,
	city                 varchar(100)  NOT NULL,
	address              varchar(100)  NOT NULL,
	businessHours        varchar(100),
	averagePrice         varchar(100),
	CONSTRAINT pk_business_id PRIMARY KEY ( id ),
	CONSTRAINT fk_business_businessInfo FOREIGN KEY (businessInfoId) REFERENCES businessInfo(id) ON DELETE CASCADE ON UPDATE CASCADE
 )
 AUTO_INCREMENT = 10000001;

CREATE INDEX idx_business_businessInfoId ON business ( businessInfoId );

CREATE TABLE businessContact ( 
	businessId           INT NOT NULL,
	contact              varchar(100) NOT NULL,
	CONSTRAINT fk_businessContact_business FOREIGN KEY (businessId) REFERENCES business(id) ON DELETE CASCADE ON UPDATE CASCADE
 );

CREATE INDEX idx_businessContact_businessId ON businessContact ( businessId );

CREATE TABLE userRating ( 
	id                   INT AUTO_INCREMENT,
	userId               INT NOT NULL,
	businessId           INT NOT NULL,
	rating               int NOT NULL,
	CONSTRAINT pk_userRating_id PRIMARY KEY (id),
    CONSTRAINT fk_userInfo_userRating FOREIGN KEY (userId) REFERENCES userInfo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_business_userRating FOREIGN KEY (businessId) REFERENCES business(id) ON DELETE CASCADE ON UPDATE CASCADE
 ) 
 AUTO_INCREMENT = 10000001;

CREATE INDEX idx_userrating_userid ON userRating ( userId );
CREATE INDEX idx_userrating_businessid ON userRating ( businessId );

CREATE TABLE userReview ( 
	id                   INT AUTO_INCREMENT,
	userId               INT NOT NULL,
	businessId           INT NOT NULL,
	review          VARCHAR(140)  NOT NULL,
	CONSTRAINT pk_userReview_id PRIMARY KEY (id),
    CONSTRAINT fk_userInfo_userReview FOREIGN KEY (userId) REFERENCES userInfo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_business_userReview FOREIGN KEY (businessId) REFERENCES business(id) ON DELETE CASCADE ON UPDATE CASCADE
 ) 
 AUTO_INCREMENT = 10000001;

CREATE INDEX idx_userreview_businessid ON userReview ( businessId );
CREATE INDEX idx_userreview_userid ON userReview ( userId );

CREATE TABLE category (
    id                   INT AUTO_INCREMENT,
    name                 VARCHAR(20) NOT NULL,
    CONSTRAINT pk_category_id PRIMARY KEY (id)
)
AUTO_INCREMENT = 1001;

CREATE TABLE categoryBusinessMap (
    categoryId          INT,
    businessId          INT,
    CONSTRAINT fk_category_categoryBusinessMap FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_business_categoryBusinessMap FOREIGN KEY (businessId) REFERENCES business(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_categoryBusinessMap_category ON categoryBusinessMap(categoryId);
CREATE INDEX idx_categoryBusinessMap_business ON categoryBusinessMap(businessId);
-------------------------------
------ Mock values ------------
-------------------------------

-- Europe region

USE elp;

INSERT INTO userInfo (name, address, contact) VALUES ('eur_user 1','Paris', 'xxxx@yy.com');
INSERT INTO userInfo (name, address, contact) VALUES ('eur_user 2', 'London', 'aaaa@bb.com');

INSERT INTO businessInfo (name, description) VALUES ('Rataouile','we freeze for eternitiy');
INSERT INTO businessInfo (name) VALUES ('BBQ');
INSERT INTO businessInfo (name, description) VALUES ('Market-O-Food','we supply for all your house needs and yummy treats');

INSERT INTO business (businessInfoId, city, address, businessHours, averagePrice) VALUES (100001, 'Paris', '6 st', 'M-F 9-6', '$$');
INSERT INTO business (businessInfoId, city, address, businessHours, averagePrice) VALUES (100002, 'London', 'madison st', 'M-S 9-10', '$');
INSERT INTO business (businessInfoId, city, address, businessHours, averagePrice) VALUES (100002, 'Lyon', 'champ de elysee', 'M-S 9-10', '$');
INSERT INTO business (businessInfoId, city, address, businessHours, averagePrice) VALUES (100003, 'Paris', 'pierre st', 'M-S 9-10', '$');
INSERT INTO business (businessInfoId, city, address, businessHours, averagePrice) VALUES (100003, 'Lyon', '10th ave', 'M-S 9-10', '$');

INSERT INTO businessContact(businessId, contact) VALUES (10000001, 'hellas@uiq.co');
INSERT INTO businessContact(businessId, contact) VALUES (10000001, '234-122-9280');
INSERT INTO businessContact(businessId, contact) VALUES (10000002, 'lol-max@rofl.com');
INSERT INTO businessContact(businessId, contact) VALUES (10000003, 'lol-max@rofl.com');
INSERT INTO businessContact(businessId, contact) VALUES (10000004, '219-999-HELLO');
INSERT INTO businessContact(businessId, contact) VALUES (10000005, '219-999-HELLO');

INSERT INTO userRating (userId, businessId, rating) VALUES (20000001, 10000001, 4);
INSERT INTO userRating (userId, businessId, rating) VALUES (20000002, 10000002, 4);
INSERT INTO userRating (userId, businessId, rating) VALUES (20000001, 10000003, 3);
INSERT INTO userRating (userId, businessId, rating) VALUES (20000002, 10000002, 2);
INSERT INTO userRating (userId, businessId, rating) VALUES (20000001, 10000003, 5);
INSERT INTO userRating (userId, businessId, rating) VALUES (20000001, 10000004, 5);
INSERT INTO userRating (userId, businessId, rating) VALUES (20000002, 10000005, 3);

INSERT INTO userReview (userId, businessId, review) VALUES (20000001, 10000002, 'yum yum yum');
INSERT INTO userReview (userId, businessId, review) VALUES (20000001, 10000005, 'Lots of things but bad servie');

INSERT INTO category(name) VALUES ('cafe');
INSERT INTO category(name) VALUES ('restaurant');
INSERT INTO category(name) VALUES ('super Market');
INSERT INTO category(name) VALUES ('fine dining');
INSERT INTO category(name) VALUES ('bakery');

INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1001, 10000001);
INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1003, 10000004);
INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1001, 10000004);
INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1002, 10000002);
INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1002, 10000003);
INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1001, 10000005);
INSERT INTO categoryBusinessMap (categoryId, businessId) VALUES (1003, 10000005);


--------------------------------
---- Stored Procedures ---------
--------------------------------

DELIMITER $$

CREATE PROCEDURE fetchUserActivity(IN user INT)
BEGIN
    SELECT userReview.businessId, userReview.review, userReview.id, businessInfo.name FROM userReview 
	    INNER JOIN business on userReview.businessId = business.id
	    INNER JOIN businessInfo on business.businessInfoId = businessInfo.Id
        WHERE userReview.userId = user;

    SELECT userRating.rating, userRating.id, userRating.businessId, businessInfo.name FROM userRating
        INNER JOIN business ON userRating.businessId = business.id
        INNER JOIN businessInfo on business.businessInfoId = businessInfo.id
        WHERE userRating.userId = user;
END $$

CREATE PROCEDURE fetchBusiness(IN business INT)
BEGIN
	DECLARE done INT DEFAULT FALSE;
    DECLARE ratingCount INT;
	DECLARE ratingSum INT;
    DECLARE ratingAvg INT;
    DECLARE temp INT;
    DECLARE cur CURSOR FOR SELECT userRating.rating FROM userRating where userRating.businessId=business;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	SET ratingSum =0;
    SET ratingCount =0;
    OPEN cur;    
    read_loop: LOOP
		FETCH cur INTO temp;
        IF done THEN
			LEAVE read_loop;
		END IF;
        SET ratingSum = (ratingSum +temp);
        SET ratingCount = (ratingCount + 1);
		END LOOP;
	
    CLOSE cur;
	SET ratingAvg = ratingSum/ratingCount;
	SELECT business.id,
	 ratingAvg as rating,
     businessInfo.name,
     businessInfo.description, 
     business.city, 
     business.address, 
     business.businessHours, 
     business.averagePrice,
     category.name as category,
     businessContact.contact
          FROM business
        INNER JOIN businessInfo ON businessInfo.id = business.businessInfoId
        INNER JOIN businessContact ON business.id = businessContact.businessId
        INNER JOIN categorybusinessmap on categorybusinessmap.businessId = business.id
        INNER JOIN category on category.id = categorybusinessmap.categoryId
                WHERE business.id = business;
END $$
DELIMITER ;
