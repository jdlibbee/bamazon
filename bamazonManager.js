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
    // console.log("connected as id " + connection.threadId);
    manage();
});

function manage() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function (res) {
        switch (res.action) {
            case "View Products for Sale":
                forSale();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
        }
    })
}


function forSale() {
    connection.query("Select * from products where stock_quantity > 0", function (err, res) {
        if (err) throw err;
        console.log(res);
        manage();
        // for (var i = 0; i < res.lenght; i++) {
        // }
    })
}

function lowInventory() {
    connection.query("Select * from products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log(res);
        manage();
        // for (var i = 0; i < res.lenght; i++) {
        // }
    })
}

function addInventory() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            message: "What would you like to update?",
            name: "updating",
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
            message: `How much do you want to add?`,
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function (count) {
            var choice;
            var currentQty;
            var updateQty;
            var upping = parseInt(count.quantity);
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === count.updating) {
                    choice = res[i];
                    currentQty = +(choice.stock_quantity);
                    updateQty = currentQty + upping;
                }
            }
            console.log(`You are adding ${upping} of ${count.updating}.`);
            console.log(`The update stock is ${updateQty}`);
            connection.query(
                "UPDATE products SET ? where ?", [{
                    stock_quantity: updateQty
                },
                {
                    item_id: choice.item_id
                }
                ],
                function (error) {
                    if (error) throw error;
                    console.log("Update was successful!");
                    manage();
                }
            )
        });
    })
}
function addProduct() {
    inquirer.prompt([{
        type: "input",
        name: "product",
        message: "What product do you want to add?"
    },
    {
        type: "input",
        name: "department",
        message: "What department would this go into?"
    },
    {
        type: "input",
        name: "price",
        message: "How much does this cost?"
    },
    {
        type: "input",
        name: "qty",
        messgage: "How much stock are you adding?"
    }]).then(function (update) {
        connection.query(
            "INSERT into products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ? , ?)", [update.product, update.department, update.price, update.qty], function (err) {
                if (err) throw err;
                console.log(`Added ${update.product} to the inventory.`);
                manage();
            }
        )
    })
}