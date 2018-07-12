DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

use bamazon_db;

CREATE TABLE products
(
    item_id int(255) not null
    auto_increment, 
    product_name VARCHAR
    (30) not null, 
    department_name VARCHAR
    (30) not null, 
    price DECIMAL
    (30, 2) not null, 
    stock_quantity int
    (30) not null, 
    PRIMARY KEY
    (item_id)
);