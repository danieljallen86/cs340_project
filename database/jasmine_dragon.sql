-- Initialize the schema 

DROP SCHEMA IF EXISTS jasmine_dragon;
CREATE SCHEMA jasmine_dragon;
USE jasmine_dragon;

-- Build the tables 

CREATE TABLE characters (
	character_id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	nation_id INT NOT NULL,
	bender TINYINT DEFAULT 0,
	avatar TINYINT DEFAULT 0,
	PRIMARY KEY(character_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE nations (
	nation_id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	capital VARCHAR(255) DEFAULT NULL,
	ruler_id INT DEFAULT NULL,
	element_id INT DEFAULT NULL,
	PRIMARY KEY (nation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE elements (
	element_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    original_bender VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (element_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE teas (
	tea_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    caffeinated TINYINT DEFAULT 1,
    PRIMARY KEY (tea_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE orders (
	order_id INT NOT NULL AUTO_INCREMENT,
    status ENUM('NEW', 'IN PROGRESS', 'COMPLETED', 'CANCELED'),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    character_id INT NOT NULL,
    tea_id INT NOT NULL,
    PRIMARY KEY (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE elements_bent (
	character_id INT NOT NULL,
    element_id INT NOT NULL,
    PRIMARY KEY (character_id, element_id),
    FOREIGN KEY (character_id) 
		REFERENCES characters(character_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
    FOREIGN KEY (element_id) 
		REFERENCES elements(element_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Foreign key additions 

ALTER TABLE characters
	ADD CONSTRAINT nation_fk
    FOREIGN KEY (nation_id) 
		REFERENCES nations(nation_id);
        
ALTER TABLE characters
	ADD CONSTRAINT unique_char_name
	UNIQUE (name);
    
ALTER TABLE nations
	ADD CONSTRAINT element_fk
    FOREIGN KEY (element_id)
		REFERENCES elements(element_id);
        
ALTER TABLE nations
	ADD CONSTRAINT ruler_fk
	FOREIGN KEY (ruler_id)
		REFERENCES characters(character_id);
        
ALTER TABLE nations
	ADD CONSTRAINT unique_nat_name
    UNIQUE (name);
    
ALTER TABLE elements
	ADD CONSTRAINT unique_element_name
    UNIQUE (name);
        
ALTER TABLE orders
	ADD CONSTRAINT customer_fk
	FOREIGN KEY (character_id)
		REFERENCES characters(character_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE;
        
ALTER TABLE orders
	ADD CONSTRAINT tea_fk
	FOREIGN KEY (tea_id)
		REFERENCES teas(tea_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE;

-- Insert Elements
INSERT INTO elements (name, original_bender)
	VALUES ('Fire', 'Dragons'), ('Earth', 'Badger Moles'), ('Water', 'Moon'), ('Air', 'Air Bison');

-- Insert Teas
INSERT INTO teas (name, caffeinated)
	VALUES ('Jasmine', 1), ('Mint', 0), ('Oolong', 1), ('Chamomile', 0), ('Green', 1), ('Lipton', 1),
		   ('Matcha', 1), ('White', 1), ('Chai', 0), ('Pu-erh', 1), ('Yerba Matte', 1), ('English Breakfast', 1),
           ('Earl Grey', 1), ('Gunpowder', 1), ('Ginseng', 0), ('Ginger', 0);

-- Insert Nations
INSERT INTO nations (name, capital, ruler_id, element_id)
	VALUES ('Fire Nation', 'Capital City', (SELECT character_id from characters WHERE name = 'Zuko'), (SELECT element_id FROM elements WHERE name = 'Fire')),
		   ('Earth Kingdom', 'Bah Sing Se', null, (SELECT element_id FROM elements WHERE name = 'Earth')),
           ('Water Tribe', null, null, (SELECT element_id FROM elements WHERE name = 'Water')),
           ('Air Nomads', null, null,  (SELECT element_id FROM elements WHERE name = 'Air'));
        
-- Insert Characters
INSERT INTO characters (name, nation_id, bender, avatar)
	VALUES ('Aang', (SELECT nation_id FROM nations WHERE name = 'Air Nomads'), 1, 1),
		   ('Zuko', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 1, 0),
           ('Katara', (SELECT nation_id FROM nations WHERE name = 'Water Tribe'), 1, 0),
           ('Sokka', (SELECT nation_id FROM nations WHERE name = 'Water Tribe'), 0, 0),
           ('Toph', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 1, 0),
           ('Iroh', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 1, 0),
           ('Azula', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 1, 0), 
           ('Mai', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 0, 0),
           ('Tai Lee', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 0, 0),
           ('Suki', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 0, 0), 
           ('Jet', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 0, 0),
           ('Smellerbee', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 0, 0),
           ('Pipsqueek', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 0, 0), 
           ('The Duke', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 0, 0),
           ('Giatso', (SELECT nation_id FROM nations WHERE name = 'Air Nomads'), 1, 0), 
           ('Hakoda', (SELECT nation_id FROM nations WHERE name = 'Water Tribe'), 0, 0),
           ('Gran Gran', (SELECT nation_id FROM nations WHERE name = 'Water Tribe'), 0, 0),
           ('Paku', (SELECT nation_id FROM nations WHERE name = 'Water Tribe'), 1, 0),
           ('Bumi', (SELECT nation_id FROM nations WHERE name = 'Earth Kingdom'), 1, 0), 
           ('Piandao', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 0, 0), 
           ('Jeong Jeong', (SELECT nation_id FROM nations WHERE name = 'Fire Nation'), 1, 0);

-- Insert Orders
INSERT INTO orders (status, order_date, character_id, tea_id)
	VALUES (1, CURRENT_TIMESTAMP, (SELECT character_id FROM characters WHERE name = 'Zuko'), (SELECT tea_id FROM teas WHERE name = 'Jasmine')), 
		   (4, '2020-03-20', (SELECT character_id FROM characters WHERE name = 'Azula'), (SELECT tea_id FROM teas WHERE name = 'Gunpowder')), 
           (3, '2020-02-14', (SELECT character_id FROM characters WHERE name = 'Aang'), (SELECT tea_id FROM teas WHERE name = 'Jasmine')), 
           (3, '2020-02-14', (SELECT character_id FROM characters WHERE name = 'Katara'), (SELECT tea_id FROM teas WHERE name = 'Mint')),
           (2, CURRENT_TIMESTAMP, (SELECT character_id FROM characters WHERE name = 'Sokka'), (SELECT tea_id FROM teas WHERE name = 'Pu-erh')), 
           (2, CURRENT_TIMESTAMP, (SELECT character_id FROM characters WHERE name = 'Suki'), (SELECT tea_id FROM teas WHERE name = 'Chamomile')),
           (3, '2020-04-05', (SELECT character_id FROM characters WHERE name = 'Iroh'), (SELECT tea_id FROM teas WHERE name = 'Ginseng')),
           (3, '2020-04-06', (SELECT character_id FROM characters WHERE name = 'Iroh'), (SELECT tea_id FROM teas WHERE name = 'Jasmine')),
           (3, '2020-04-07', (SELECT character_id FROM characters WHERE name = 'Iroh'), (SELECT tea_id FROM teas WHERE name = 'Green')), 
           (3, '2020-04-07', (SELECT character_id FROM characters WHERE name = 'Jeong Jeong'), (SELECT tea_id FROM teas WHERE name = 'Matcha')),
           (4, '2020-04-03', (SELECT character_id FROM characters WHERE name = 'Tai Lee'), (SELECT tea_id FROM teas WHERE name = 'Pu-erh')),
           (2, '2020-04-03', (SELECT character_id FROM characters WHERE name = 'Mai'), (SELECT tea_id FROM teas WHERE name = 'Yerba Matte')),
           (1, '2020-04-04', (SELECT character_id FROM characters WHERE name = 'Jet'), (SELECT tea_id FROM teas WHERE name = 'Lipton')),
           (4, '2020-04-05', (SELECT character_id FROM characters WHERE name = 'Bumi'), (SELECT tea_id FROM teas WHERE name = 'Green')),
           (3, '2020-03-12', (SELECT character_id FROM characters WHERE name = 'Suki'), (SELECT tea_id FROM teas WHERE name = 'Chamomile')),
           (3, '2020-07-07', (SELECT character_id FROM characters WHERE name = 'Gran Gran'), (SELECT tea_id FROM teas WHERE name = 'Oolong')),
           (1, '2020-03-15', (SELECT character_id FROM characters WHERE name = 'Aang'), (SELECT tea_id FROM teas WHERE name = 'White')),
           (4, '2020-04-07', (SELECT character_id FROM characters WHERE name = 'Giatso'), (SELECT tea_id FROM teas WHERE name = 'Earl Grey')),
           (1, '2020-05-07', (SELECT character_id FROM characters WHERE name = 'Paku'), (SELECT tea_id FROM teas WHERE name = 'Chai')),
           (2, '2020-06-01', (SELECT character_id FROM characters WHERE name = 'Piandao'), (SELECT tea_id FROM teas WHERE name = 'English Breakfast')),
           (3, '2020-02-17', (SELECT character_id FROM characters WHERE name = 'Sokka'), (SELECT tea_id FROM teas WHERE name = 'Lipton')),
           (1, '2020-06-28', (SELECT character_id FROM characters WHERE name = 'Toph'), (SELECT tea_id FROM teas WHERE name = 'Ginger')),
           (4, '2020-05-25', (SELECT character_id FROM characters WHERE name = 'The Duke'), (SELECT tea_id FROM teas WHERE name = 'White')),
           (2, '2020-06-30', (SELECT character_id FROM characters WHERE name = 'Katara'), (SELECT tea_id FROM teas WHERE name = 'Matcha')),
           (3, '2020-05-01', (SELECT character_id FROM characters WHERE name = 'Smellerbee'), (SELECT tea_id FROM teas WHERE name = 'Pu-erh'));

-- Insert Elements Bent
INSERT INTO elements_bent (character_id, element_id)
	VALUES ((SELECT character_id FROM characters WHERE name = 'Aang'), (SELECT element_id FROM elements WHERE name = 'Air')),
		   ((SELECT character_id FROM characters WHERE name = 'Aang'), (SELECT element_id FROM elements WHERE name = 'Water')), 
           ((SELECT character_id FROM characters WHERE name = 'Aang'), (SELECT element_id FROM elements WHERE name = 'Earth')), 
           ((SELECT character_id FROM characters WHERE name = 'Aang'), (SELECT element_id FROM elements WHERE name = 'Fire')), 
           ((SELECT character_id FROM characters WHERE name = 'Zuko'), (SELECT element_id FROM elements WHERE name = 'Fire')), 
           ((SELECT character_id FROM characters WHERE name = 'Katara'), (SELECT element_id FROM elements WHERE name = 'Water')), 
           ((SELECT character_id FROM characters WHERE name = 'Toph'), (SELECT element_id FROM elements WHERE name = 'Earth')), 
           ((SELECT character_id FROM characters WHERE name = 'Iroh'), (SELECT element_id FROM elements WHERE name = 'Fire')), 
           ((SELECT character_id FROM characters WHERE name = 'Azula'), (SELECT element_id FROM elements WHERE name = 'Fire')), 
           ((SELECT character_id FROM characters WHERE name = 'Giatso'), (SELECT element_id FROM elements WHERE name = 'Air')), 
           ((SELECT character_id FROM characters WHERE name = 'Paku'), (SELECT element_id FROM elements WHERE name = 'Water')), 
		   ((SELECT character_id FROM characters WHERE name = 'Bumi'), (SELECT element_id FROM elements WHERE name = 'Earth')), 
           ((SELECT character_id FROM characters WHERE name = 'Jeong Jeong'), (SELECT element_id FROM elements WHERE name = 'Fire'));