// const user = require("../models/user")
const _ = require("lodash")
const authentication = require("../authentication");
const db = require('../db');

class Login {
    async login(req, res) {
        try {
            if (!(_.isEmpty(req.body.username) || _.isEmpty(req.body.password))) {
                let query = `SELECT * FROM user WHERE username =? AND password =?`;
                let myUser = await db.executeQuery(query, [req.body.username, req.body.password]);
                if (!_.isEmpty(myUser[0])) {
                    return res.status(200).send({token: authentication.create(myUser)});
                }
                return res.status(403).send({message:"Username or Password is incorrect"});
            }
            return res.status(403).send({message:"please send username and password"});
        } catch (err) {
            console.log(err);
            return res.status(500).send({message:"Something went wrong"});
        }
    }
}


module.exports = new Login();