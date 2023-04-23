INSERT INTO department (name)
VALUES ('Sales'),
       ('Development'),
       ('Finance'),
       ('IT');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Smith', 2, 1),
       ('Maggie', 'Wonte', 4, null),
       ('Tim', 'Che', 1, 2),
       ('Monica', 'Roll', 6, null),
       ('Bianca', 'Reese', 3, 2),
       ('Fiona', 'Arber', 4, null),
       ('Olive', 'Murphy', 8, null);

INSERT INTO role (title, salary, department_id)
VALUES ('IT Support', 50000, 4),
       ('IT Manager', 70000, 4),
       ('Sales Person', 70000, 1),
       ('Sales Manager', 100000, 1),
       ('Financial Accountant', 70000, 3),
       ('CFO', 120000, 3),
       ('Junior Developer', 70000, 2), 
       ('Senior Developer', 120000, 2);   
       
