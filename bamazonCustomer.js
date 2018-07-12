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
    connection.query("SELECT item_id, product_name from products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.lenght; i++) {
            inquirer.prompt({
                type: "list",
                message: "What would you like to purchase?",
                name: "buying",
                choices: [res[i]]
            }).then)function(buy) {
                inquirer.prompt({
                    type: "input",
                    message: "How Much would you like to purchase?",
                    name: "quantity",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                        console.log("You did not enter a valid quantity.");
                        shop();
                    }
                })
            }
}
    })
}