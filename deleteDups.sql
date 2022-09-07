SELECT id, CONCAT(FirstName, " ", LastName), Email, Teacher, Classes FROM students;

DELETE s 
FROM students s INNER JOIN students s2 
WHERE s.LastName=s2.LastName AND s.FirstName=s2.FirstName AND s.Email=s2.Email AND s.id<s2.id;


UPDATE students SET ClassYear="Α' Έτος" WHERE ClassYear="Α' Τάξη";
UPDATE students SET ClassYear="Β' Έτος" WHERE ClassYear="Β' Τάξη";
UPDATE students SET ClassYear="Γ' Έτος" WHERE ClassYear="Γ' Τάξη";
UPDATE students SET ClassYear="Δ' Έτος" WHERE ClassYear="Δ' Τάξη";
UPDATE students SET ClassYear="Α' Έτος Διπλώματος" WHERE ClassYear="Α' Τάξη Διπλώματος";
UPDATE students SET ClassYear="Β' Έτος Διπλώματος" WHERE ClassYear="Β' Τάξη Διπλώματος";