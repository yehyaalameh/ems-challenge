-- This file contains the SQL schema, it drops all tables and recreates them

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- To add a field to a table do
-- CREATE TABLE table_name (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nullable_field TEXT,
--     non_nullable_field TEXT NOT NULL,
--     numeric_field INTEGER,
--     unique_field TEXT UNIQUE,
--     unique_non_nullable_field TEXT NOT NULL UNIQUE,
--     date_field DATE,
--     datetime_field DATETIME
-- );

-- Create employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Personal fields
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    phone_number TEXT UNIQUE, 
    date_of_birth DATE, 
    photo_path TEXT,
    
    -- Professional fields
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL,
    start_date DATE NOT NULL,
    end_date DATE, 
    cv_path TEXT,
    

    CHECK (email LIKE '%_@__%.__%'), 
    CHECK (phone_number IS NULL OR phone_number GLOB '[0-9]*'), 
    CHECK (salary IS NULL OR salary >= 0), 
    CHECK (date_of_birth IS NULL OR date_of_birth < DATE('now')),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Rest of the fields
    summary TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    employee_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
