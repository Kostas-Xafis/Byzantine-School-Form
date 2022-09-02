SELECT id, CONCAT(FirstName, " ", LastName), Email, Teacher, Classes FROM students;

DELETE s 
FROM students s INNER JOIN students s2 
WHERE s.LastName=s2.LastName AND s.FirstName=s2.FirstName AND s.Email=s2.Email AND s.id<s2.id;