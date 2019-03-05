var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// connection.connect(function(err) {
//     if (err) throw err;
//     // console.log(`connected as ID ${connection.threadId} \n`);
// });

var readAllProducts = function() {
    console.log("Printing all products.... \n");
    connection.query("SELECT * FROM  products", function(err,res) {
        if (err) throw err;
        console.log(res);
        connection.end();

    });
};

var findProduct = function(item, quantity) {
    connection.query({
        sql: `SELECT * FROM products WHERE product_name = ?`,
        values: [item]
      }, function (error, results, fields) {
        if (error) throw error;
        if (results[0].stock_quantity < quantity) {
            console.log(`Sorry, we don't have that many of ${item}`);
        } else {
            var remaining = results[0].stock_quantity - quantity;
            updateInventory(item, remaining);
        }
        // console.log(results[0].stock_quantity);
        connection.end();
      });
};

var updateInventory = function(item, quantity) {
    connection.query({
        sql: `UPDATE products SET ? WHERE ?`,
        values: [
        {stock_quantity: quantity},
        {product_name: item}
        ]
    }, function(error, results, fields) {
        console.log("Quantity updated!");
    
    });
};

var openStore = function() {
    inquirer.prompt([
        {
            name: "buy",
            message: "What would you like to buy"
        },
        {
            name: "quantity",
            message: "How many units would you like?"
        }
    ]).then(function(answer) {
        console.log(answer);
        var item = answer.buy;
        var quantity = answer.quantity;

        //finds product and updates inventory if quantity is there
        findProduct(item, quantity);


    });
}

openStore();

