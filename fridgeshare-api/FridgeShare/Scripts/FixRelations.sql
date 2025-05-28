-- First, make sure we have at least one admin user
IF NOT EXISTS (SELECT 1 FROM Users WHERE IsAdmin = 1)
BEGIN
    INSERT INTO Users (Name, LastName, Email, Username, Password, IsAdmin, Active, RegisteredOn)
    VALUES ('Admin', 'User', 'admin@example.com', 'admin', 'hashedpassword', 1, 1, GETUTCDATE())
END

-- Get the admin user ID
DECLARE @AdminId int;
SELECT @AdminId = MIN(Id) FROM Users WHERE IsAdmin = 1;

-- Add sample news posts
INSERT INTO NewsPosts (Title, Content, AuthorId, CreatedAt, UpdatedAt)
VALUES 
    ('Svarbus pranešimas', 'Sveiki atvykę į FridgeShare! Čia rasite svarbią informaciją apie sistemos atnaujinimus.', @AdminId, GETUTCDATE(), NULL),
    ('Sistemos atnaujinimas', 'Informuojame, kad atlikome sistemos atnaujinimus. Pridėtos naujos funkcijos.', @AdminId, DATEADD(day, -1, GETUTCDATE()), NULL),
    ('Naujos funkcijos', 'Džiaugiamės galėdami pristatyti naujas produktų valdymo funkcijas!', @AdminId, DATEADD(day, -2, GETUTCDATE()), NULL);

-- Verify the inserted data
SELECT 
    n.Id,
    n.Title,
    n.Content,
    n.CreatedAt,
    n.UpdatedAt,
    u.Name + ' ' + u.LastName as AuthorName
FROM NewsPosts n
JOIN Users u ON n.AuthorId = u.Id
ORDER BY n.CreatedAt DESC;