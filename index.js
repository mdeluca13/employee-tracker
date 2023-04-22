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
        'Add Employee', 
        'Update Employee Role',
        'View all Roles', 
        'Add Role', 
        'View all Departments',
        'Add Department', 
        'Quit'
    ],
};

// Question for adding Department
const addDepartmentQ = {
    type: 'input',
    message: 'What is the name of the Department?',
    name: 'name',
}

// Function to prompt add department questions
function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((data) => {
        console.log(data.name);
        db.query(`INSERT INTO department (name) VALUES ('${data.name}')`, function (err, result){
            if (err) throw err;
            console.log(`${data.name} has been added as a Department`)
        });
    });
    // init();
};

// Function to prompt add role questions
function addRole() {
    let departments = [];
    let departmentIDs = [];

    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        for (let i=0; i < results.length; i++) {
            departments.push(results[i].name);
            departmentIDs.push(results[i].id);
        };
    });

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
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.title}', ${data.salary}, '${selectedDepartment}')`, function (err, result){
            if (err) throw err;
            
            console.log(`${data.title} has been added as a new Role`);
        });
    });
    // init();
};

// Function to prompt add employee questions
function addEmployee() {
    let roles = [];
    let roleIDs = [];
    let managers = ['No Manager'];
    let managerIDs = [];

    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        for (let i=0; i < results.length; i++) {
            roles.push(results[i].title);
            roleIDs.push(results[i].id);
        };
    });
    console.log(roles)
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i=0; i < results.length; i++) {
            if (results[i].manager_id == null) {
                managers.push(`${results[i].first_name} ${results[i].last_name}`);
                managerIDs.push(results[i].id);
            };
        };
    });

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
        console.log(data);
        let roleIndex = roles.indexOf(data.roles);
        let selectedRole = roleIDs[roleIndex];
        let managerIndex = managers.indexOf(data.managers);
        let selectedManager = managerIDs[managerIndex - 1];
        if (data.managers = 'No Manager') {
            selectedManager = null;
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first_name}', '${data.last_name}', '${selectedRole}', ${selectedManager})`, function (err, result){
                if (err) throw err;
                
                console.log(`${data.first_name} ${data.last_name} has been added as a new Employee`);
            });
        }
        else {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first_name}', '${data.last_name}', '${selectedRole}', '${selectedManager}')`, function (err, result){
                if (err) throw err;
                
                console.log(`${data.first_name} ${data.last_name} has been added as a new Employee`);
            });
        }
    });
    // init();
};

// Function to prompt update employee role questions
function updateEmployeeRole() {
    let employees = [];
    let employeeIDs = [];
    let roles = [];
    let roleIDs = [];

    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i=0; i < results.length; i++) {
            employees.push(`${results[i].first_name} ${results[i].last_name}`);
            employeeIDs.push(results[i].id);
        };
    });
    console.log(roles)
    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        for (let i=0; i < results.length; i++) {
            roles.push(results[i].title);
            roleIDs.push(results[i].id);
        };
    });

    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the reason for the Role Change?",
                name: 'last_name',
            },
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
            console.log(data);
            let employeeIndex = employees.indexOf(data.employee_names);
            let selectedEmployee = employeeIDs[employeeIndex];
            let roleIndex = roles.indexOf(data.role_titles);
            let selectedRole = roleIDs[roleIndex];
            db.query(`UPDATE employee SET role_id = ${selectedRole} WHERE id = ${selectedEmployee}`, function (err, result){
                if (err) throw err;
                
                console.log(`${data.employee_names} has been updated with a new Role`);
            });
        });
    // init();
};

// Function to view all employees table
function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        console.table(results);
    });
    // init();
};

// Function to view all roles table
function viewAllRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        console.table(results);
    })
    // init();
};

// Function to view all employees table
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.table(results);
    });
    // init();
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