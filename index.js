const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const loginController = require("./controller/login");
const categoryController = require("./controller/category");
const serviceController = require("./controller/service");
require('./db').createConnection();

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(function(req, res, next) {
    console.log(req.path, req.method);
    console.log(req.body);
    next();
})

app.use(require("./authentication").validate);


// login using username and password
app.post('/login', function(req, res) {
    return loginController.login(req, res);
});

// add category
app.post('/category', function(req, res) {
    return categoryController.add(req, res);
});

// get all catgory
app.get('/category', function(req, res) {
    return categoryController.getAll(req, res);
});

// update category by id
app.put('/category/:id', function(req, res) {
    return categoryController.update(req, res);
});

// delete category if services are 0
app.delete('/category/:id', function(req, res) {
    return categoryController.delete(req, res);
});

// add service to a category
app.post('/category/:id/service', function(req, res) {
    return serviceController.add(req, res);
});

// get all service of a category
app.get('/category/:id/service', function(req, res) {
    return serviceController.getAll(req, res);
});

// delete service by category id and service id
app.delete('/category/:id/service/:serviceId', function(req, res) {
    return serviceController.delete(req, res);
});

// update service by category id and service id
app.put('/category/:id/service/:serviceId', function(req, res) {
    return serviceController.update(req, res);
});

app.all("*", function(req, res) {
    return res.send("404 not found")
});


app.listen(5000, () => {console.log("server is running in port 5000")});