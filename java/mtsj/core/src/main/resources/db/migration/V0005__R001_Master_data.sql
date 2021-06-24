INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (0, 1, 'Customer', true);
INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (1, 1, 'Waiter', true);
INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (2, 1, 'Manager', true);
INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (3, 1, 'Admin', true);

INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (0, 1, 'Bob', '{bcrypt}$2a$10$qPM1WjcRKAffHxWXYEfPJOh2vGPlT/Fdv.hJX/LaZjzg/Wtj2csqO', false, 'bob@gmail.com', 0);
INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (1, 1, 'James', '{bcrypt}$2a$10$1CAKyUHbX6RJqT5cUP6/aOMTIlYYvGIO/a3Dt/erbYKKgmbgJMGsG', false, 'james@ctro4.de', 1);
INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (2, 1, 'Albert', '{bcrypt}$2a$10$IsTlZemkiPKE2gjtnSMlJOX5.uitNHXNRpLYyvyxNbHEhjpY.XdTq', false, 'manager@ctro4.de', 2);
INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (3, 1, 'Steve', '{bcrypt}$2a$10$qPM1WjcRKAffHxWXYEfPJOh2vGPlT/Fdv.hJX/LaZjzg/Wtj2csqO', false, 'admin@ctro4.de', 3);


INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (0, 1, 4);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (1, 1, 4);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (2, 1, 4);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (3, 1, 4);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (4, 1, 6);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (5, 1, 6);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (6, 1, 6);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (7, 1, 8);
INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES (8, 1, 8);
