-- password: 'password'
INSERT INTO [user](username, password) VALUES ('kyle', '$2a$12$3rDTJPsrEeLR5B744JEddOMDCRwXKGsB5Zwjxs3a16KOYXj1zQpLi');

INSERT INTO authority (name, [user]) VALUES ('READ', '1');
INSERT INTO authority (name, [user]) VALUES ('WRITE', '1');
