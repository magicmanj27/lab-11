DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  image VARCHAR(255),
  description TEXT
);

INSERT INTO books (title, image, description) 
VALUES('Harry Potter','https://i.imgur.com/J5LVHEL.jpg','This book is so damn cool');