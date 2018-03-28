const express = require("express");
const hbs = require("hbs");
const fs = require("fs");
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

//app.use() = syntax for middleware use
// req - object containing all info about request - http method, path, query parameters, app/browser/device
app.use(
(req, res, next) =>
{
    //following 2 lines of code print current date whenever page get is requested
    var now = new Date().toString();

    console.log(now);
    var log = req.method + ", " + req.url;
    //req.method - logs the http request method (i.e. "get", "post")
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err) => {
        if (err) {
            console.log("Unable to append to server.log");
        }
    });
    next();
    //next allows the page to continue to be served - without it, request would stall forever without response even though it reaches server
});
/*
app.use(
    (req, res, next) => {
        res.render("maintenance.hbs", {
            pageTitle: "Uh Oh"
        });
    }
);*/

// renders static files
app.use(express.static(__dirname + "/public"))

// registers helper function so that template can use JS function or access data
hbs.registerHelper("getCurrentYear",
() =>
{
    return new Date().getFullYear();
})

app.get("/",
(req, res) =>
{
    //res.send("<h1>Hello Express!</h1>");
    res.render("home.hbs", {
        pageTitle: "Home",
        message: "Hello world"
    });
});

app.get("/about",
(req, res) =>
{
   res.render("about.hbs", {
       pageTitle: "About Page"
   }); 
});

app.get("/bad",

(req, res) =>
{
    res.send({
      errorMessage: "Bad request"  
    })
});

app.listen(port, () =>
{
    console.log("Server is up on port" + port);
});
//3000 for local port