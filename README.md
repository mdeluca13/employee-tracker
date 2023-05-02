# employee-tracker

## Description

Employee Tracker is a Node.JS and MYSQL program that allows you to update a MYSQL Database and Tables through the Node.JS command lines. Employers need a way to track and manage employees, roles and departments, so by having this program, you can easily update your database with the most up to date information and retrieve that information based on specific criteria. 

I was able to demonstrate what I have learned throughout the Carleton University Full Stack Coding Bootcamp as well as use my researching skills to determine how MYSQL works to complete the tasks I needed it to, as well as troubleshoot bugs that came up.

## Installation

You will need to install [Node.JS](https://nodejs.org/en/download) to run the Employee Tracker. 

You will also have to install through the package.json file: 

- [Inquirer](https://www.npmjs.com/package/inquirer/v/8.2.4)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [console.table](https://www.npmjs.com/package/console.table)

This can be done through npm install in your Node.JS Terminal.

## Usage

1. Run mysql -u root -p in Terminal for schema.sql
2. Run source schema.sql to initialize the Database and Tables
3. Run mysql -u root -p in Terminal for seeds.sql
4. Run USE tracker_db to select the Database we are using
5. Run source seeds.sql to add base information to the Tables
6. When node index.js is run through the index.JS Terminal, this will initialize the program.
7. You will be prompted with a list of commands you can run including View Employees/Roles/Departments, Add Employees/Roles/Departments, Delete Employees/Roles/Departments, Update Employee Role/Manager, View Employee by Manager. 
8. Each command selected will prompt you to answer questions so the command can be complete (Except View Employees/Roles/Departments which need no command). 
9. You will then be prompted with either a table if you are viewing, or a line in the terminal stating that the command has been completed. 

You can view a [demonstration of the Employee Tracker here](https://drive.google.com/file/d/1iHiKGkpcy5r21TdVPFh7HSjISwfde3Af/view).

## Credits

n/a

## License

The License used was the [MIT License](https://choosealicense.com/licenses/mit/). Also found in repository under LICENSE.

## Questions

If you have any questions, please reachout via [GitHub](https://github.com/mdeluca13/).
