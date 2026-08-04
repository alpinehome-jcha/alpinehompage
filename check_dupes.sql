SELECT name, username, COUNT(*) as count FROM "alpine-home".dealers 
GROUP BY name, username HAVING COUNT(*) > 1;
