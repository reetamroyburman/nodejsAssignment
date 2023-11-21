const _ = require("lodash")
const db = require('../db');

class Categories {

    async add(req, res) {
        try {
            if(_.isEmpty(req.body.categoryName)) {
                return res.status(400).send({message: "Please send category name"});
            }
            let query = `INSERT INTO category (categoryName) VALUES (?)`;
            await db.executeQuery(query, [req.body.categoryName]);
            return res.status(200).send({message:"Category added successfully"});
        } catch (err) {
            console.log(err)
        }
    }


    async getAll(req, res) {
        try {
            let query = `SELECT * FROM category`;
            let data = await db.executeQuery(query, []);
            if(data[0].length == 0) {
                return res.status(400).send({message: "No data found"});
            }
            return res.status(200).send({data: data[0]})
        } catch (err) {
            console.log(err)
        }
    }



    async update(req, res) {
        try {
            if(_.isEmpty(req.body.categoryName) || _.isEmpty(req.params.id)) {
                return res.status(400).send({message: "Id or categoryName is missing"});
            }
            let query = `UPDATE category SET categoryName = ? WHERE id=?`;
            let data = await db.executeQuery(query, [req.body.categoryName, req.params.id]);
            if(data[0].affectedRows == 0) {
                return res.status(400).send({message: "Id is not matching with any record"});
            }
            return res.status(200).send({message: "Updated successfully"});
        } catch (err) {
            console.log(err);
        }
    }


    async delete(req, res) {
        try {
            let query = `SELECT * FROM service WHERE categoryId = ?`;
            let data = await db.executeQuery(query, [req.params.id]);
            if(data[0].length>0) {
                return res.status(400).send({message: "There are sevices linked to this category"});
            }
            query = `DELETE FROM category WHERE id = ?`;
            await db.executeQuery(query, [req.params.id]);

            return res.status(200).send({message: "Deleted successfully"});
        } catch (err) {
            console.log(err);
        }
    }

}


module.exports = new Categories();