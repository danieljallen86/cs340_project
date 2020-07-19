DROP SCHEMA IF EXISTS jasmine_dragon;
CREATE SCHEMA jasmine_dragon;
USE jasmine_dragon;

CREATE TABLE characters (
	character_id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	nation_id INT NOT NULL,
	bender BIT DEFAULT 0,
	element_id INT DEFAULT NULL,
	avatar BIT DEFAULT 0,
	PRIMARY KEY(character_id)
);

CREATE TABLE nations (
	nation_id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	capital VARCHAR(255) DEFAULT NULL,
	ruler_id INT DEFAULT NULL,
	element_id INT DEFAULT NULL,
	PRIMARY KEY (nation_id)
);

CREATE TABLE elements (
	element_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    original_bender VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (element_id)
);

CREATE TABLE teas (
	tea_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    caffeinated BIT DEFAULT 1,
    PRIMARY KEY (tea_id)
);

CREATE TABLE orders (
	order_id INT NOT NULL AUTO_INCREMENT,
    order_date DATE NOT NULL,
    character_id INT NOT NULL,
    tea_id INT NOT NULL,
    PRIMARY KEY (order_id)
);

CREATE TABLE elements_bent (
	character_id INT NOT NULL,
    element_id INT NOT NULL,
    PRIMARY KEY (character_id, element_id),
    FOREIGN KEY (character_id) 
		REFERENCES characters(character_id),
    FOREIGN KEY (element_id) 
		REFERENCES elements(element_id)
);

ALTER TABLE characters
	ADD CONSTRAINT nation_fk
    FOREIGN KEY (nation_id) 
		REFERENCES nations(nation_id);
    
ALTER TABLE characters
	ADD CONSTRAINT element_fk
    FOREIGN KEY (element_id)
		REFERENCES elements(element_id);
        
ALTER TABLE nations
	ADD CONSTRAINT ruler_fk
	FOREIGN KEY (ruler_id)
		REFERENCES characters(character_id);
        
ALTER TABLE nations
	ADD CONSTRAINT nat_element_fk
    FOREIGN KEY (element_id)
		REFERENCES elements(element_id);
        
ALTER TABLE orders
	ADD CONSTRAINT customer_fk
	FOREIGN KEY (character_id)
		REFERENCES characters(character_id);
        
ALTER TABLE orders
	ADD CONSTRAINT tea_fk
	FOREIGN KEY (tea_id)
		REFERENCES teas(tea_id);