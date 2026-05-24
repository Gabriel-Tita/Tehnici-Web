CREATE USER gabriel WITH ENCRYPTED PASSWORD 'gabriel';
GRANT ALL PRIVILEGES ON DATABASE mobilehub TO gabriel ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gabriel;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gabriel;


DROP TYPE IF EXISTS categ_telefon;
DROP TYPE IF EXISTS culoare_telefon;
DROP TYPE IF EXISTS branduri;

CREATE TYPE categ_telefon AS ENUM( 'low-end', 'mid-range', 'flagship', 'ultra-premium');
CREATE TYPE culoare_telefon AS ENUM('negru', 'verde', 'albastru', 'alb', 'mov', 'auriu');
CREATE TYPE branduri AS ENUM('samsung', 'apple', 'motorola', 'oppo', 'xiaomi', 'honor');


CREATE TABLE IF NOT EXISTS telefoane (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   memorie_ram INT NOT NULL CHECK (memorie_ram>=0),   
   tip_telefon categ_telefon DEFAULT 'flagship',
   an_lansare INT NOT NULL CHECK (an_lansare>=0),
   culoare culoare_telefon DEFAULT 'negru',
   brand branduri,
   continut VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   pliabil BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into telefoane (nume, descriere, pret, memorie_ram, tip_telefon, an_lansare, culoare, brand, continut, pliabil, imagine) VALUES 
('Iphone 17 Pro Max', 'Telefon Apple Iphone 17 Pro Max 5G, 2TB, Negru', 12599.90 , 12, 'flagship', 2025, 'negru', 'apple', '{"Cablu"}', False, 'iphone17promax.jpg'),

('Iphone 16 Pro Max', 'Telefon Apple Iphone 16 Pro Max 5G, 2TB, Alb', 9549.90 , 12, 'flagship', 2024, 'alb', 'apple', '{"Cablu"}', False, 'iphone16promax.jpg'),

('Iphone 17', 'Telefon Apple Iphone 17 5G, 256GB, Albastru', 4699.90 , 8, 'flagship', 2025, 'albastru', 'apple', '{"Cablu"}', False,'iphone17.jpg'),

('Iphone Air', 'Telefon Apple Iphone Air 5G, 512GB, eSIM, Verde', 5684.90 , 12, 'flagship', 2025, 'verde', 'apple', '{"Cablu"}', False,'iphoneair.jpg'),

('Samsung Galaxy S26 Ultra', 'Telefon Samsung Galaxy S26 Ultra 5G, 1TB, Mov', 7825.90 , 16, 'flagship', 2026, 'mov', 'samsung', '{"Cablu", "S-Pen"}', False,'s26ultra.jpg'),

('Samsung Galaxy S25 Ultra', 'Telefon Samsung Galaxy S25 Ultra 5G, 1TB, Negru', 6545.90 , 16, 'flagship', 2025, 'negru', 'samsung', '{"Cablu", "S-Pen"}', False,'s25ultra.jpg'),

('Samsung Galaxy S26', 'Telefon Samsung Galaxy S26 5G, 512GB, Alb', 4644.90 , 12, 'flagship', 2026, 'alb', 'samsung', '{"Casti"}', False,'s26.jpg'),

('Samsung Galaxy S26 Plus', 'Telefon Samsung Galaxy S26 Plus 5G, 512GB, Mov', 5404.90 , 12, 'flagship', 2026, 'mov', 'samsung', '{"Incarcator"}', False,'s26plus.jpg'),

('Samsung Galaxy A57', 'Telefon Samsung Galaxy A57 5G, 256GB, Auriu', 2432.90 , 8, 'mid-range', 2026, 'auriu', 'samsung', '{"Cablu", "Incarcator"}', False,'a57.jpg'),

('Samsung Galaxy A37', 'Telefon Samsung Galaxy A37 5G, 256GB, Alb', 2024.90 , 8, 'mid-range', 2026, 'alb', 'samsung', '{"Incarcator", "Casti"}', False,'a37.jpg'),

('Samsung Galaxy A17', 'Telefon Samsung Galaxy A17 5G, 256GB, Auriu', 1086.90 , 8, 'low-end', 2026, 'auriu', 'samsung', '{"Cablu", "Casti", "Incarcator"}', False,'a17.jpg'),

('Samsung Galaxy Fold7', 'Telefon Samsung Galaxy Fold7 5G, 256GB, Albastru', 8531.90 , 12, 'ultra-premium', 2025, 'albastru', 'samsung', '{"Cablu"}', True,'fold7.jpg'),

('Samsung Galaxy Fold6', 'Telefon Samsung Galaxy Fold6 5G, 256GB, Negru', 6931.90 , 12, 'ultra-premium', 2024, 'negru', 'samsung', '{"Cablu"}', True,'fold6.jpg'),

('Motorola G06', 'Telefon Motorola G06 4G, 256GB, Albastru', 499.90 , 4, 'low-end', 2025, 'albastru', 'motorola', '{"Cablu", "Casti", "Incarcator"}', False,'g06.jpg'),

('Motorola Edge 60 Pro', 'Telefon Motorola Edge 60 Pro 5G, 256GB, Verde', 1599.90 , 8, 'mid-range', 2025, 'verde', 'motorola', '{"Incarcator", "Cablu", "Casti"}', False,'edge60pro.jpg'),

('Honor X7d', 'Telefon Honor X7d 4G, 128GB, Auriu', 649.90 , 6, 'low-end', 2025, 'auriu', 'honor', '{"Cablu", "Casti", "Incarcator"}', False,'x7d.jpg'),

('Honor Magic 8 Lite', 'Telefon Honor Magic 8 Lite 5G, 256GB, Verde', 1599.90 , 8, 'mid-range', 2025, 'verde', 'honor', '{"Cablu", "Incarcator"}', False,'magic8lite.jpg'),

('Oppo Find X9 Ultra', 'Telefon Oppo Find X9 Ultra 5G, 512GB, Negru', 8599.90 , 12, 'flagship', 2026, 'negru', 'oppo', '{"Cablu"}', False,'findx9ultra.jpg'),

('Oppo Find X9', 'Telefon Oppo Find X9 5G, 512GB, Alb', 5099.90 , 12, 'flagship', 2025, 'alb', 'oppo', '{"Casti"}', False,'findx9.jpg'),

('Xiaomi 17 Ultra', 'Telefon Xiaomi 17 Ultra 5G, 512GB, Negru', 6399.90 , 16, 'flagship', 2026, 'negru', 'xiaomi', '{"Incarcator"}', False,'xiaomi17ultra.jpg');



GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gabriel;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gabriel;