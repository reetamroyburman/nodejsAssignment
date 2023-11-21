const _ = require("lodash")
const db = require('../db');

class Service {

    async deletePrices(serviceId) {
        let query = `DELETE FROM serviceprice WHERE serviceId=?`;
        await db.executeQuery(query, [serviceId]);
    }

    async addPrices(data, serviceId) {
        // remove existing prices
        await this.deletePrices(serviceId);
        for(let i=0;i<data.length;i++) {
            let query = `INSERT INTO serviceprice (serviceId, duration, price, type) VALUES(?,?,?,?)`;
            await db.executeQuery(query, [serviceId, data[i].duration, data[i].price, data[i].type]);
        }
    }

    async add(req, res) {
        try {
            if(_.isEmpty(req.params.id) || _.isEmpty(req.body.serviceName) || _.isEmpty(req.body.type)) {
                return res.status(400).send({message: "Category id or service name or type is missing"});
            }
            let query = `INSERT INTO service (categoryId, serviceName, type) VALUES (?, ?, ?)`;
            let data = await db.executeQuery(query, [req.params.id, req.body.serviceName, req.body.type]);
            if(req.body.price) {
                await this.addPrices(req.body.price, data[0].insertId);
            }
            return res.status(200).send({message:"service added successfully"});
        } catch (err) {
            console.log(err)
        }
    }


    async getAll(req, res) {
        try {
            let query = `SELECT * FROM service WHERE categoryId=?`;
            let data = await db.executeQuery(query, [req.params.id]);
            if(data[0].length == 0) {
                return res.status(400).send({message: "No data found"});
            }
            for(let i=0;i<data[0].length;i++) {
                query = `SELECT * FROM serviceprice WHERE serviceId=?`;
                let servicePrices = (await db.executeQuery(query, [data[0][i].id])); 
                data[0][i].price = servicePrices[0];
            }
            return res.status(200).send({data: data[0]})
        } catch (err) {
            console.log(err)
        }
    }

    async delete(req, res) {
        try {
            let query = `DELETE FROM service WHERE id=?`;
            await db.executeQuery(query, [req.params.serviceId]);
            await this.deletePrices(req.params.serviceId);
            return res.status(200).send({message: "Deleted service successfully"});
        } catch (err) {
            console.log(err)
        }
    }



    async update(req, res) {
        try {
            if(_.isEmpty(req.params.id) || _.isEmpty(req.body.serviceName) || _.isEmpty(req.body.type)) {
                return res.status(400).send({message: "Category id or service name or type is missing"});
            }
            let query = `UPDATE service SET categoryId=?, serviceName=?, type=? WHERE id=?`;
            let data = await db.executeQuery(query, [req.params.id, req.body.serviceName, req.body.type, req.params.serviceId]);

            if(req.body.price) {
                await this.addPrices(req.body.price, req.params.serviceId);
            } else {
                await this.deletePrices(req.params.serviceId);
            }
            return res.status(200).send({message:"Updated service successfully"});
        } catch (err) {
            console.log(err)
        }
    }

}


module.exports = new Service();