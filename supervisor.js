var mysql = require("mysql");
var inquirer = require("inquirer");
var clitable = require("cli-table");

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
    // do something
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