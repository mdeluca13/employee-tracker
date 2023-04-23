// Variable declaration
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
);

// Initial Question for user input
const initQuestion = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'todo',
    choices: [
        'View all Employees',
        'View all Roles',
        'View all Departments',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Update Employee Role',
        'Update Employee Manager',
        'View Employee by Manager',
        'View Employee by Department',
        'Delete Employee',
        'Delete Role',
        'Delete Department',
        'Quit'
    ],
};

// Question for adding Department
const addDepartmentQ = {
    type: 'input',
    message: 'What is the name of the Department?',
    name: 'name',
}

// Function add department
function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((data) => {
            console.log(data.name);
            db.query(`INSERT INTO department (name) VALUES ('${data.name}')`, function (err, result) {
                if (err) throw err;
                console.log(`${data.name} has been added as a Department`);
                init();
            });
        });
};

// Function to add role
function addRole() {
    let departments = [];
    let departmentIDs = [];

    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            departments.push(results[i].name);
            departmentIDs.push(results[i].id);
        };

        inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the Role?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the Salary of the Role?',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'Which Department does the Role belong to?',
                name: 'department_id',
                choices: departments,
            },
        ])
        .then((data) => {
            let index = departments.indexOf(data.department_id);
            let selectedDepartment = departmentIDs[index];
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.title}', ${data.salary}, '${selectedDepartment}')`, function (err, result) {
                if (err) throw err;
                console.log(`${data.title} has been added as a new Role`);
                init();
            });
        });
    });
};

// Function to add employee
function addEmployee() {
    let roles = [];
    let roleIDs = [];
    let managers = ['No Manager'];
    let managerIDs = [];

    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            roles.push(results[i].title);
            roleIDs.push(results[i].id);
        };
        db.query('SELECT * FROM employee', function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                if (results[i].manager_id == null) {
                    managers.push(`${results[i].first_name} ${results[i].last_name}`);
                    managerIDs.push(results[i].id);
                };
            };
            inquirer
            .prompt([
                {
                    type: 'input',
                    message: "What is the Employee's First Name?",
                    name: 'first_name',
                },
                {
                    type: 'input',
                    message: "What is the Employee's Last Name?",
                    name: 'last_name',
                },
                {
                    type: 'list',
                    message: "What is the Employee's role?",
                    name: 'roles',
                    choices: roles,
                },
                {
                    type: 'list',
                    message: "Who is the Employee's Manager?",
                    name: 'managers',
                    choices: managers,
                },
            ])
            .then((data) => {
                let roleIndex = roles.indexOf(data.roles);
                let selectedRole = roleIDs[roleIndex];
                let managerIndex = managers.indexOf(data.managers);
                let selectedManager = managerIDs[managerIndex - 1];
                if (data.managers == 'No Manager') {
                    selectedManager = null;
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first_name}', '${data.last_name}', ${selectedRole}, ${selectedManager})`, function (err, result) {
                        if (err) throw err;
                        console.log(`${data.first_name} ${data.last_name} has been added as a new Employee`);
                        init();
                    });
                }
                else {
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first_name}', '${data.last_name}', ${selectedRole}, ${selectedManager})`, function (err, result) {
                        if (err) throw err;
                        console.log(`${data.first_name} ${data.last_name} has been added as a new Employee`);
                        init();
                    });
                };
            });
        });
    });
};

// Function to update employee role
function updateEmployeeRole() {
    let employees = [];
    let employeeIDs = [];
    let roles = [];
    let roleIDs = [];

    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            employees.push(`${results[i].first_name} ${results[i].last_name}`);
            employeeIDs.push(results[i].id);
        };
        db.query('SELECT * FROM role', function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                roles.push(results[i].title);
                roleIDs.push(results[i].id);
            };
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: "Which Employee's Role do you want to Update?",
                        name: 'employee_names',
                        choices: employees,
                    },
                    {
                        type: 'list',
                        message: "Which Role do you want to assign the selected Employee?",
                        name: 'role_titles',
                        choices: roles,
                    },
                ])
                .then((data) => {
                    let employeeIndex = employees.indexOf(data.employee_names);
                    let selectedEmployee = employeeIDs[employeeIndex];
                    let roleIndex = roles.indexOf(data.role_titles);
                    let selectedRole = roleIDs[roleIndex];
                    db.query(`UPDATE employee SET role_id = ${selectedRole} WHERE id = ${selectedEmployee}`, function (err, result) {
                        if (err) throw err;
                        console.log(`${data.employee_names} has been updated with a new Role`);
                        init();
                    });
                });
        });   
    });
};

// Function to update employee manager
function updateEmployeeManager() {
    let employees = [];
    let employeeIDs = [];
    let managers = ['No Manager'];
    let managerIDs = [];

    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            employees.push(`${results[i].first_name} ${results[i].last_name}`);
            employeeIDs.push(results[i].id);
            if (results[i].manager_id == null) {
                managers.push(`${results[i].first_name} ${results[i].last_name}`);
                managerIDs.push(results[i].id);
            };
        };
        inquirer
        .prompt([
            {
                type: 'list',
                message: "Which Employee's Manager do you want to Update?",
                name: 'employees',
                choices: employees,
            },
            {
                type: 'list',
                message: "Which Manager do you want to assign the selected Employee?",
                name: 'managers',
                choices: managers,
            },
        ])
        .then((data) => {
            let employeeIndex = employees.indexOf(data.employees);
            let selectedEmployee = employeeIDs[employeeIndex];
            let managerIndex = managers.indexOf(data.managers);
            let selectedManager = managerIDs[managerIndex - 1];
            if (data.managers == 'No Manager') {
                selectedManager = null;
                db.query(`UPDATE employee SET manager_id = ${selectedManager} WHERE id = ${selectedEmployee}`, function (err, result) {
                    if (err) throw err;
                    console.log(`${data.employee_names} has been updated with a new Manager`);
                    init();
                });
            }
            else {
                db.query(`UPDATE employee SET manager_id = ${selectedManager} WHERE id = ${selectedEmployee}`, function (err, result) {
                    if (err) throw err;
                    console.log(`${data.employee_names} has been updated with a new Manager`);
                    init();
                });
            };
        }); 
    });
};

// function to view list of employees by their manager
function viewEmployeeByManager() {
    let managers = ['No Manager'];
    let managerIDs = [];

    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            if (results[i].manager_id == null) {
                managers.push(`${results[i].first_name} ${results[i].last_name}`);
                managerIDs.push(results[i].id);
            };
        };
        inquirer
        .prompt([
            {
                type: 'list',
                message: "Which Manager's Employees do you want to view?",
                name: 'managers',
                choices: managers,
            },
        ])
        .then((data) => {
            let managerIndex = managers.indexOf(data.managers);
            let selectedManager = managerIDs[managerIndex - 1];
            if (data.managers == 'No Manager') {
                selectedManager = null;
                db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT (t.first_name, + ' ', + t.last_name) AS manager_name FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN employee t ON employee.manager_id = t.id WHERE employee.manager_id IS NULL`, function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });
            }
            else {
                db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT (t.first_name, + ' ', + t.last_name) AS manager_name FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN employee t ON employee.manager_id = t.id WHERE employee.manager_id = ${selectedManager}`, function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });
            };
        }); 
    });
};

// function to view list of employees by their department
// function viewEmployeeByDepartment() {
//     let departments = [];
//     let departmentIDs = [];

//     db.query('SELECT * FROM department', function (err, results) {
//         if (err) throw err;
//         for (let i = 0; i < results.length; i++) {
//             departments.push(results[i].name);
//             departmentIDs.push(results[i].id);
//         };
//         console.log(departments)
//         inquirer
//         .prompt([
//             {
//                 type: 'list',
//                 message: "Which Department's Employees do you want to view?",
//                 name: 'departments',
//                 choices: departments,
//             },
//         ])
//         .then((data) => {
//             let departmentIndex = departments.indexOf(data.departments);
//             let selectedDepartment = departmentIDs[departmentIndex];
//             // db.query(`SELECT * FROM role`, function (err, result) {
//             //     if (err) throw err;
//             //     console.table(result); 
//                 db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT (t.first_name, + ' ', + t.last_name) AS 'manager_name' FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN employee t ON employee.manager_id = t.id WHERE role.department_id IS ${selectedDepartment}`, function (err, result) {
//                     if (err) throw err;
//                     console.table(result);
//                     init();
//                 });
//             // });
//         }); 
//     });
// };

// Function to view all employees table
function viewAllEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT (t.first_name, + ' ', + t.last_name) AS 'manager_name' FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN employee t ON employee.manager_id = t.id", function (err, results) {
        if (err) throw err;
        console.table(results);
        init();
    });
};

// Function to view all roles table
function viewAllRoles() {
    db.query('SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON department.id = role.department_id', function (err, results) {
        if (err) throw err;
        console.table(results);
        init();
    });
};

// Function to view all employees table
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.table(results);
        init();
    });
};

// Function to delete department
function deleteDepartment() {
    let departments = [];
    let departmentIDs = [];

    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            departments.push(results[i].name);
            departmentIDs.push(results[i].id);
        };

        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which Department do you want to Delete?',
                name: 'departments',
                choices: departments,
            },
        ])
        .then((data) => {
            let index = departments.indexOf(data.departments);
            let selectedDepartment = departmentIDs[index];
            db.query(`DELETE FROM department WHERE id = ${selectedDepartment}`, function (err, result) {
                if (err) throw err;
                console.log(`${data.departments} has been Deleted as a Department`);
                init();
            });
        });
    });
};

// Function to delete Employee
function deleteEmployee() {
    let employees = [];
    let employeeIDs = [];

    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            employees.push(`${results[i].first_name} ${results[i].last_name}`);
            employeeIDs.push(results[i].id);
        };

        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which Employee do you want to Delete?',
                name: 'employees',
                choices: employees,
            },
        ])
        .then((data) => {
            let index = employees.indexOf(data.employees);
            let selectedEmployee = employeeIDs[index];
            db.query(`DELETE FROM employee WHERE id = ${selectedEmployee}`, function (err, result) {
                if (err) throw err;
                console.log(`${data.employees} has been Deleted as an Employee`);
                init();
            });
        });
    });
};

// Function to delete role
function deleteRole() {
    let roles = [];
    let roleIDs = [];

    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            roles.push(results[i].title);
            roleIDs.push(results[i].id);
        };

        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which Role do you want to Delete?',
                name: 'roles',
                choices: roles,
            },
        ])
        .then((data) => {
            let index = roles.indexOf(data.roles);
            let selectedRole = roleIDs[index];
            db.query(`DELETE FROM role WHERE id = ${selectedRole}`, function (err, result) {
                if (err) throw err;
                console.log(`${data.roles} has been Deleted as a Role`);
                init();
            });
        });
    });
};

// Initializing the function of prompting the questions for user input
function init() {
    inquirer
        .prompt(initQuestion)
        .then((data) => {
            if (data.todo == 'Add Employee') {
                addEmployee();
            }
            else if (data.todo == 'Update Employee Role') {
                updateEmployeeRole();
            }
            else if (data.todo == 'Update Employee Manager') {
                updateEmployeeManager();
            }
            else if (data.todo == 'Add Role') {
                addRole();
            }
            else if (data.todo == 'Add Department') {
                addDepartment();
            }
            else if (data.todo == 'View all Employees') {
                viewAllEmployees();
            }
            else if (data.todo == 'View all Roles') {
                viewAllRoles();
            }
            else if (data.todo == 'View all Departments') {
                viewAllDepartments();
            }
            else if (data.todo == 'View Employee by Manager') {
                viewEmployeeByManager();
            }
            else if (data.todo == 'View Employee by Department') {
                viewEmployeeByDepartment();
            }
            else if (data.todo == 'Delete Department') {
                deleteDepartment();
            }
            else if (data.todo == 'Delete Role') {
                deleteRole();
            }
            else if (data.todo == 'Delete Employee') {
                deleteEmployee();
            }
            else if (data.todo == 'Quit') {
                db.end();
                console.log('Goodbye 👋');
            }
        });
};

// Function call to initialize questions after connecting to db
db.connect((err) => {
    if (err) throw err;
    init();
});