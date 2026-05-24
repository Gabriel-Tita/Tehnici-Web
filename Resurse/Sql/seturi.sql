GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gabriel;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gabriel;

CREATE TABLE IF NOT EXISTS seturi (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT
);

INSERT into seturi (nume, descriere) VALUES 
('Set 2024', 'Set telefoane de top din 2024'),
 
('Set 2025', 'Set telefoane potrivite din 2025'),

('Set 2026', 'Set telefoane de ultima generatie (2026)'),
 
('Set Samsung', 'Set telefoane Samsung'),
 
('Set Familie', 'Set telefoane pentru fiecare membru al familiei')