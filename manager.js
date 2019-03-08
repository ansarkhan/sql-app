var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// var viewProducts = function() {
//     console.log("Printing all products.... \n");
//     connection.query("SELECT * FROM products", function(err,res) {
//         if (err) throw err;
//         console.log(res);
//         connection.end();
//     });
// };

var rowArr = [];
var tableArr = [];

var viewProducts = function() {
    console.log("Printing all products.... \n");
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;


        var prodTable = new Table({
            head: ['ID', 'Name', 'Department', 'Price', 'Stock', 'Sales']
        });

        var tempArr = [];
        res.forEach(ele => {
            tempArr.push(Object.values(ele));
        });

        tempArr.forEach(ele => {
            prodTable.push(ele);
        });

        // tableArr.push(Object.values(res[0]));
        // prodTable.push(tableArr);

        console.log(prodTable.toString());

        connection.end();
    });
};

// for (var key in p) {
//     if (p.hasOwnProperty(key)) {
//         console.log(key + " -> " + p[key]);
//     }
// }

var lowInventory = function() {
    console.log("Printing low inventory products.... \n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err,res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
};

var addInventory = function() {
    console.log("Your products include...");
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        res.forEach(element => {
            console.log(element.product_name);
        });
    });

    inquirer.prompt([
        {
            name: "item",
            message: "Which item would you like to add"
        },
        {
            name: "quantity",
            message: "How much inventory are you adding?"
        }
    ]).then(function(answer) {

        
        connection.query({
            sql: `UPDATE products SET ? WHERE ?`,
            values: [
                //how to add more
            {stock_quantity: answer.quantity},
            {product_name: answer.item}
            ]
        }, function(error, results, fields) {
            console.log("Quantity updated!");
            if (error) throw error;
            connection.end();
        
        });

    });
}

var addProduct = function() {
    console.log("Add Product");
    inquirer.prompt([
        {
            name: "product_name",
            message: "What is the product name?"
        },
        {
            name: "department_name",
            message: "What department is the item in?"
        },
        {
            name: "price",
            message: "What is the price of the item?"
        },
        {
            name: "stock_quantity",
            message: "How much stock do you have?"
        }
    ]).then(function(answer) {
        var name = answer.product_name;
        var department = answer.department_name;
        var price = answer.price;
        var stock = answer.stock_quantity;

        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: name,
              department_name: department,
              price: price,
              stock_quantity: stock
            },
            function(err, res) {
              console.log(res.affectedRows + " product inserted!\n");
            }
          );
        connection.end();


    });
}


var managerMenu = function() {
    inquirer.prompt({
        name: "manager",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View Products", "View Low Inventory", "Add Inventory", "Add Product"]
    }).then(function(answer) {

        switch(answer.manager) {

            case "View Products":
                viewProducts();
                break;
            case "View Low Inventory":
              lowInventory();
              break;
            case "Add Inventory":
                addInventory();
                break;
            case "Add Product":
                addProduct();
                break;
            default:
                console.log("Not a valid option!");

          }
    });
}

managerMenu();

// var table = new Table({
//     head: ['TH 1 label', 'TH 2 label']
// });
 
// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//     ['First value', 'Second value']
//   , ['First value', 'Second value']
// );
 
// console.log(table.toString());


// var prodTable = new Table({
//     head: ['ID', 'Name', 'Department', 'Price', 'Stock', 'Sales']
// });


// var testA = [
//     [1, 2, 3, 4 ,5, 6],
//     [1, 2, 3, 4 ,5, 6]
// ]

// testA.forEach(ele => {
//     prodTable.push(ele);
// });

// console.log(prodTable.toString());

