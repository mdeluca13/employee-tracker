// Variable declaration
const inquirer = require('inquirer');

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
        console.log(data);
  });
};

// Questions for adding Role
const addRoleQ = [
    {
      type: 'input',
      message: 'What is the name of the Role?',
      name: 'title',
    },
    {
        type: 'input',
        message: 'What is the Salary of the Role?',
        name: 'Salary',
    },
    {
        type: 'list',
        message: 'Which Department does the Role belong to?',
        name: 'department_id',
        choices: [
            'list of departments', 
            'list of departments', 
            'list of departments'
        ],
    },
];

// Function to prompt add role questions
function addRole() {
    inquirer
        .prompt(addRoleQ)
        .then((data) => {
        console.log(data);
  });
};

// Questions for adding employee
const addEmployeeQ = [
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
        name: 'role_id',
        choices: [
            'list of roles', 
            'list of roles', 
            'list of roles'
        ],
    },
    {
        type: 'list',
        message: "Who is the Employee's Manager?",
        name: 'manager_id',
        choices: [
            'None', 
            'list of managers', 
            'list of managers'
        ],
    },
];

// Function to prompt add employee questions
function addEmployee() {
    inquirer
        .prompt(addEmployeeQ)
        .then((data) => {
        console.log(data);
  });
};

// questions for updating employee role
const updateEmployeeRoleQ = [
    {
        type: 'list',
        message: "Which Employee's Role do you want to Update?",
        name: 'employee_name',
        choices: [
            'list of employees', 
            'list of employees', 
            'list of employees'
        ],
    },
    {
        type: 'list',
        message: "Which Role do you want to assign the selected Employee?",
        name: 'role_selected',
        choices: [
            'list of roles', 
            'list of roles', 
            'list of roles'
        ],
    },
];

// Function to prompt update employee role questions
function updateEmployeeRole() {
    inquirer
        .prompt(updateEmployeeRoleQ)
        .then((data) => {
        console.log(data);
  });
};

// Initializing the function of prompting the questions for user input
function init() {
    inquirer
        .prompt(initQuestion)
        .then((data) => {
            if (data = "Add Employee") {
                addEmployee();
            }
            else if (data = "Update Employee Role") {
                updateEmployeeRole();
            }
            else if (data = "Add Role") {
                addRole();
            }
            else if (data = "Add Department") {
                addDepartment();
            }
  });
};

// Function call to initialize questions
init();