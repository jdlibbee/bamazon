//variables
var inquirer = require("inquirer");
var mysql = require("mysql");
var pass = require("./config");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: pass.password,
    database: "bamazon_db"
});

//Connect to mysql and start inquirer
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    shop();
});

//functions for inquirer options. 
function shop() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            message: "What would you like to purchase?",
            name: "buying",
            choices: function () {
                var prods = [];
                for (var i = 0; i < res.length; i++) {
                    prods.push(res[i].product_name);
                }
                return prods;
            }
        },
        {
            type: "input",
            message: `What quantity would you like to purchase?`,
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function (buy) {
            var choice;
            var currentQty;
            var newQty;
            var total;
            var purchasing = parseInt(buy.quantity);
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === buy.buying) {
                    choice = res[i];
                    currentQty = +(choice.stock_quantity);
                    newQty = currentQty - purchasing;
                    total = parseInt(+(choice.price) * purchasing);
                }
            }
            console.log(`${purchasing} of ${buy.buying} is up for purchase.`);
            console.log(`Your total is $${total}`);
            var grandTotal = choice.product_sales + total;
            if (currentQty > purchasing) {
                connection.query(
                    "UPDATE products SET ?,? where ?", [{
                        stock_quantity: newQty
                    },
                    {
                        product_sales: grandTotal
                    },
                    {
                        item_id: choice.item_id
                    }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log("Purchsase was successful!");
                        shop();
                    }
                )
            } else {
                console.log(`Not enough ${choice.product_name} for this order.`);
                shop();
            }
        });
    })
}
