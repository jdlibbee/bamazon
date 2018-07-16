//variables
var inquirer = require("inquirer");
var mysql = require("mysql");
var pass = require("./config");
var Table = require('easy-table')

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
    supervise();
});

function supervise() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Products Sales by Department", "Create New Department"]
    }).then(function (res) {
        switch (res.action) {
            case "View Products Sales by Department":
                depSales();
                break;
            case "Create New Department":
                newDep();
        }
    })
};

function depSales() {
    connection.query("select departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, departments.total_profit from departments INNER join products ON departments.department_name=products.department_name", function (err, res) {
        if (err) throw err;
        console.log(Table.print(res));
        supervise();
    })
};

function newDep() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the new department?",
        name: "newDepartment"
    },
    {
        type: "input",
        message: "What's this department's overhead costs?",
        name: "overhead"
    }]).then(function (dep) {
        connection.query(
            "INSERT into departments (department_name, over_head_costs) VALUES(?, ?)", [dep.newDepartment, dep.overhead], function (err) {
                if (err) throw err;
                console.log(`Added ${dep.newDepartment}.`);
                supervise();
            }
        )
        supervise();
    });
}