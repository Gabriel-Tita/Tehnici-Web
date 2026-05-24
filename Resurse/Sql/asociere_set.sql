GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gabriel;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gabriel;

CREATE TABLE IF NOT EXISTS asociere_set (
   id serial PRIMARY KEY,
   id_set int,
   id_produs int
);

INSERT into asociere_set (id_set, id_produs) VALUES 
('1', '2'), 
('1', '13'),
('2', '6'),
('2', '19'),
('2', '17'),
('3', '11'),
('3', '18'),
('3', '20'),
('4', '2'),
('4', '3'),
('4', '4'),
('5', '5'),
('5', '12'),
('5', '9'),
('5', '10')