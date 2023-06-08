ALTER TABLE sysusers
    MODIFY COLUMN session_exp_date bigint;

UPDATE sysusers SET session_exp_date=1688768512359 WHERE email="koxafis@gmail.com";