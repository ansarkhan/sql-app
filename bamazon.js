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
            console.log(`Sorry, we don't have that ${quantity} of ${item}`);
        } else {
            var remaining = results[0].stock_quantity - quantity;

            updateInventory(item, remaining);
            printTotal(item, quantity, results[0].price);
            trackSales(item, quantity, results[0].price);
        }

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
        // console.log("Quantity updated!");
        if (error) throw error;
    
    });
};

var trackSales = function(item, quantity, price) {
    connection.query({
        sql: 'UPDATE products SET ? WHERE ?',
        values: [
            {product_sales: quantity * price},
            {product_name: item}
        ]
    }, function(error, results, fields) {
        if (error) throw error;
    });
}

var printTotal = function(item, quantity, price) {
    var total = quantity * price;
    console.log(`Your total for ${item} is $${total} at $${price} each `);
}

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
        // console.log(answer);
        var item = answer.buy;
        var quantity = answer.quantity;

        //finds product, processes order and prints total
        findProduct(item, quantity);


    });
}

openStore();

var query = connection.query(
    "INSERT INTO products SET ?",
    {
      flavor: "Rocky Road",
      price: 3.0,
      quantity: 50
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      updateProduct();
    }
  );