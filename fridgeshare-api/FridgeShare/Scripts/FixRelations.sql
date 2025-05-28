-- Set the database to use UTF-8
ALTER DATABASE FridgeShareDb
COLLATE Lithuanian_CI_AS;

-- First, make sure we have at least one admin user
IF NOT EXISTS (SELECT 1 FROM Users WHERE IsAdmin = 1)
BEGIN
    INSERT INTO Users (Name, LastName, Email, Username, Password, IsAdmin, Active, RegisteredOn)
    VALUES (N'Admin', N'User', N'admin@example.com', N'admin', N'hashedpassword', 1, 1, GETUTCDATE())
END

-- Get the admin user ID
DECLARE @AdminId int;
SELECT @AdminId = MIN(Id) FROM Users WHERE IsAdmin = 1;

-- Add sample news posts with N prefix for Unicode strings
INSERT INTO NewsPosts (Title, Content, AuthorId, CreatedAt, UpdatedAt)
VALUES 
    (N'Svarbus pranesimas', N'Sveiki atvyke i FridgeShare! Cia rasite svarbia informacija apie sistemos atnaujinimus.', @AdminId, GETUTCDATE(), NULL),
    (N'Sistemos atnaujinimas', N'Informuojame, kad atlikome sistemos atnaujinimus. Pridetos naujos funkcijos.', @AdminId, DATEADD(day, -1, GETUTCDATE()), NULL),
    (N'Naujos funkcijos', N'Dziaugiames galedami pristatyti naujas produktu valdymo funkcijas!', @AdminId, DATEADD(day, -2, GETUTCDATE()), NULL);

-- Verify the inserted data
SELECT 
    n.Id,
    n.Title,
    n.Content,
    n.CreatedAt,
    n.UpdatedAt,
    u.Name + N' ' + u.LastName as AuthorName
FROM NewsPosts n
JOIN Users u ON n.AuthorId = u.Id
ORDER BY n.CreatedAt DESC;