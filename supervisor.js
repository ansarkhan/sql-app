var mysql = require("mysql");
var inquirer = require("inquirer");
var clitable3 = require("cli-table3");

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
   connection.query({
       sql: `
       SELECT departments.id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS Sales, SUM(products.product_sales) - departments.overhead_costs AS Profit
       FROM departments LEFT JOIN products ON (departments.department_name = products.department_name)
       GROUP BY departments.id
       `
   }, function(error, results, fields) {
       if (error) throw error;
       console.log(results);
       connection.end();
   });

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