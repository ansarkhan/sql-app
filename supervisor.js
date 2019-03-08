var mysql = require("mysql");
var inquirer = require("inquirer");
var clitable = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var salesByDep = function() {
    /*
    display the following:
    - department_id
    - department_name
    - over_head_costs (made up #)
    - product sales;'
    - total profit - overheadcosts minus sales
    */

};

var createDep = function() {
    inquirer.prompt([
        {
            name: "department",
            message: "What is the department name?"
        },
        {
            name: "cost",
            message: "What are the overhead costs?"
        }
    ]).then(function(answer) {


        connection.query({
            sql: "INSERT INTO departments SET ?",
            values: [
                {department_name: answer.department},
                {overhead_costs: answer.cost}
            ]
        }, function(error, results, fields) {
            if (error) throw error;
            connection.end();
        })
        
    });

};


var supervisorMenu = function() {
    inquirer.prompt({
        name: "supervisor",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["Sales by Department", "Create Department"]
    }).then(function(answer) {

        switch(answer.supervisor) {

            case "Sales by Department":
                salesByDep();
                break;
            case "Create Department":
                createDep();
                break;
            default:
                console.log("Not a valid option!");

          }
    });
};

supervisorMenu();