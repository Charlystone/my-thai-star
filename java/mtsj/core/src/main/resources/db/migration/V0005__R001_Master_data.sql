INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (0, 1, 'Customer', true);
INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (1, 1, 'Waiter', true);
INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (2, 1, 'Manager', true);
INSERT INTO UserRole(id, modificationCounter, name, active) VALUES (3, 1, 'Admin', true);

INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (0, 1, 'Waiter', '{bcrypt}$2a$10$1CAKyUHbX6RJqT5cUP6/aOMTIlYYvGIO/a3Dt/erbYKKgmbgJMGsG', false, 'waiter@mythaistar.de', 1);
INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (1, 1, 'Manager', '{bcrypt}$2a$10$gCcf75k2hLp3yU2QOycPXOef6EegPGYtA0YAjtLcLbjMAIEC.yU6u', false, 'manager@mythaistar.de', 2);
INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (2, 1, 'Admin', '{bcrypt}$2a$10$R07w/Bq3nP7Wt4qaNIWZ4eTUutUuQdH9AsdGi.jhQRU/vKsIrdcyK', false, 'admin@mythaistar.de', 3);
INSERT INTO User(id, modificationCounter, username, password, twoFactorStatus, email, idRole) VALUES (3, 1, 'John Doe', '{bcrypt}$2a$10$P1L55wMFHsBY3zD/yey2VOfEknteWnKVMkAVZwUL3P7zENG6uKoY2', false, 'JohnDoe@gmail.com', 0);


INSERT INTO "Table"(id, modificationCounter, seatsNumber) VALUES 
(0, 1, 4),
(1, 1, 4),
(2, 1, 4),
(3, 1, 4),
(4, 1, 6),
(5, 1, 6),
(6, 1, 6),
(7, 1, 8),
(8, 1, 8);

INSERT INTO "BOOKING"(id, modificationCounter, idUser, name, bookingToken, comment, email, expirationDate, bookingDate, creationDate, canceled, bookingType, idTable, idOrder, assistants) VALUES
(1000001, 1, NULL, STRINGDECODE('Ben M\u00fcller'), 'CB_20210624_e853db7edae3610db4d50b725e79bf31', NULL, STRINGDECODE('ben.m\u00fcller98@gmail.com'), TIMESTAMP '2021-07-05 09:00:32', TIMESTAMP '2021-07-05 08:00:32', TIMESTAMP '2021-06-24 11:26:53.427942', FALSE, NULL, 1, NULL, 4),
(1000002, 1, NULL, 'Paul Schmidt', 'CB_20210624_fb7be6c428d1feeff0fe34038e029a19', NULL, 'pauls@web.de', TIMESTAMP '2021-07-05 08:50:22', TIMESTAMP '2021-07-05 07:50:22', TIMESTAMP '2021-06-24 11:26:59.882445', FALSE, NULL, 2, NULL, 2),
(1000003, 1, NULL, 'Anton Zimmermann', 'CB_20210624_6b0c522c8bfb3032dc4fb10e62d4f1f9', NULL, 'antonv.zimmermann56@t-online.de', TIMESTAMP '2021-07-05 08:30:42', TIMESTAMP '2021-07-05 07:30:42', TIMESTAMP '2021-06-24 11:27:05.174389', FALSE, NULL, 3, NULL, 3),
(1000004, 1, NULL, 'Linus Schwarzer', 'CB_20210624_66249249f85f1dc0d1b169c50cf0f0e8', NULL, 'linus.heidelberg.schwarzer@outlook.com', TIMESTAMP '2021-07-05 12:00:44', TIMESTAMP '2021-07-05 11:00:44', TIMESTAMP '2021-06-24 11:27:10.996954', FALSE, NULL, 4, NULL, 1),
(1000005, 1, NULL, 'Jacob Neumann', 'CB_20210624_5f240af9127091dd3d2b732b05f396b6', NULL, 'jacobi.da.neumann@t-online.de', TIMESTAMP '2021-07-06 09:53:02', TIMESTAMP '2021-07-06 08:53:02', TIMESTAMP '2021-06-24 11:27:14.89625', FALSE, NULL, 5, NULL, 5),
(1000006, 1, NULL, STRINGDECODE('Liam Schr\u00f6der'), 'CB_20210624_2f7ccf80fd8fed864e250dda409ed364', NULL, STRINGDECODE('liamschr\u00f6der2594@outlook.com'), TIMESTAMP '2021-07-06 19:00:43', TIMESTAMP '2021-07-06 18:00:43', TIMESTAMP '2021-06-24 11:27:18.937744', FALSE, NULL, 6, NULL, 3),
(1000007, 1, NULL, 'Emil Wolf', 'CB_20210624_f6276b2d900a651fa7ddebac504c2257', NULL, 'emil.y.wolf@web.de', TIMESTAMP '2021-07-08 13:00:20', TIMESTAMP '2021-07-08 12:00:20', TIMESTAMP '2021-06-24 11:27:23.557205', FALSE, NULL, 7, NULL, 2),
(1000008, 1, NULL, 'Oscar Marker', 'CB_20210624_5b0211d6d44c22dcfb676ec811d6e3cf', NULL, 'oscardermaker@t-online.de', TIMESTAMP '2021-07-05 15:00:37', TIMESTAMP '2021-07-05 14:00:37', TIMESTAMP '2021-06-24 11:27:28.763973', FALSE, NULL, 8, NULL, 6),
(1000009, 1, NULL, 'Max Richter', 'CB_20210624_ad9d4d89e1ae0805960c03bbb724e4a4', NULL, 'maxlouisrichter@web.deoutlook.com', TIMESTAMP '2021-07-05 08:45:25', TIMESTAMP '2021-07-05 07:45:25', TIMESTAMP '2021-06-24 11:27:51.51067', FALSE, NULL, 4, NULL, 4),
(1000010, 1, NULL, 'Henry Bauer', 'CB_20210624_6c9c2ff64d7ed2f3662a6d96b6d95d3d', NULL, 'henry531999@gmail.com', TIMESTAMP '2021-07-05 07:00:33', TIMESTAMP '2021-07-05 06:00:33', TIMESTAMP '2021-06-24 11:27:55.967453', FALSE, NULL, 5, NULL, 1),
(1000011, 1, NULL, 'Maximilian Koch', 'CB_20210624_6ff24bc482d93a9f909beb1973d1719f', NULL, 'maximilian.der.koch@gmail.com', TIMESTAMP '2021-07-07 20:30:10', TIMESTAMP '2021-07-07 19:30:10', TIMESTAMP '2021-06-24 11:27:46.295761', FALSE, NULL, 3, NULL, 6),
(1000012, 1, NULL, STRINGDECODE('Luca Sch\u00e4fer'), 'CB_20210624_a419de0529fcc4f8773a1718ba62d6f4', NULL, 'lucatonioitalia@web.de', TIMESTAMP '2021-07-05 16:15:50', TIMESTAMP '2021-07-05 15:15:50', TIMESTAMP '2021-06-24 11:27:59.33196', FALSE, NULL, 7, NULL, 2),
(1000013, 1, NULL, 'Felix Hoffmann', 'CB_20210624_4400c958cf769b8c19555ae39bfbcebb', NULL, 'felixhoffmann9813@gmx.de', TIMESTAMP '2021-07-05 13:00:42', TIMESTAMP '2021-07-05 12:00:42', TIMESTAMP '2021-06-24 11:28:06.859137', FALSE, NULL, 1, NULL, 5),
(1000014, 1, NULL, 'Lucas Schulz', 'CB_20210624_e266d99f13337ab4a109b8f51ee96107', NULL, 'lucas.m.schulz@outlook.com', TIMESTAMP '2021-07-06 15:15:10', TIMESTAMP '2021-07-06 14:15:10', TIMESTAMP '2021-06-24 11:28:48.794033', FALSE, NULL, 6, NULL, 4),
(1000015, 1, NULL, 'Louis Becker', 'CB_20210624_20614edb5c38fe113e1ecddaabf4ee54', NULL, 'louisb.mannheim@t-online.de', TIMESTAMP '2021-07-06 16:00:03', TIMESTAMP '2021-07-06 15:00:03', TIMESTAMP '2021-06-24 11:28:13.691122', FALSE, NULL, 5, NULL, 3);         
INSERT INTO "PUBLIC"."BOOKING" VALUES
(1000016, 1, NULL, 'Noah Wagner', 'CB_20210624_ab5bf7d8f7b5ed1a890216e6cc41e36e', NULL, 'noahlinus.wagner@gmx.de', TIMESTAMP '2021-07-05 08:14:40', TIMESTAMP '2021-07-05 07:14:40', TIMESTAMP '2021-06-24 11:28:27.240929', FALSE, NULL, 4, NULL, 3),
(1000017, 1, NULL, 'Finn Meyer', 'CB_20210624_56abc080d0c2abb984ba009c16bc943e', NULL, 'finnmey99@gmail.com', TIMESTAMP '2021-07-05 09:15:24', TIMESTAMP '2021-07-05 08:15:24', TIMESTAMP '2021-06-24 11:28:29.667173', FALSE, NULL, 7, NULL, 1),
(1000018, 1, NULL, 'Leon Weber', 'CB_20210624_ba93f2dadd2b9a1ad1ef04d5bc570e9f', NULL, 'leon45w@hotmail.com', TIMESTAMP '2021-07-08 15:15:00', TIMESTAMP '2021-07-08 14:15:00', TIMESTAMP '2021-06-24 11:28:32.983513', FALSE, NULL, 8, NULL, 6),
(1000019, 1, NULL, 'Leon Weber', 'CB_20210624_115d9304f0a66a4b120ae48701d503e7', NULL, 'elias.thomas.fischer@gmail.com', TIMESTAMP '2021-07-05 07:30:37', TIMESTAMP '2021-07-05 06:30:37', TIMESTAMP '2021-06-24 11:28:37.038115', FALSE, NULL, 3, NULL, 2),
(1000020, 1, NULL, 'Jonas Schneider', 'CB_20210624_678397e48ef5853eab3b392f11786786', NULL, 'jonasschneider1971@web.de', TIMESTAMP '2021-07-06 12:30:17', TIMESTAMP '2021-07-06 11:30:17', TIMESTAMP '2021-06-24 11:28:42.386003', FALSE, NULL, 1, NULL, 4);     
