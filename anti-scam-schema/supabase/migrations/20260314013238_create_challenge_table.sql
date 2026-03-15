CREATE TABLE challenge
(
  id SERIAL REFERENCES users(id),
  challenge VARCHAR(255) NOT NULL,
  response VARCHAR(255) NOT NULL,
  creation_date DATE NOT NULL,
  PRIMARY KEY (id)
);