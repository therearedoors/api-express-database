const express = require('express')
const db = require('../utils/database')
const controller = require('../controllers/pets.controller.js')
const petsRouter = express.Router()

petsRouter.get("/", (req,res) => {
    const baseQuery = 'SELECT * FROM pets'
    console.log(req.query)
    const values = []
    let whereQuery = controller.handleWhereQuery(baseQuery,req.query,values)
    let paginatedQuery = controller.handlePagination(whereQuery,req.query)
    db.query(paginatedQuery,values)
    .then(dataBaseRes => {
        res.json({pets:dataBaseRes.rows})
    })
    .catch(e => {
        console.log(e)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

petsRouter.get("/:id", (req,res) => {

    db.query('SELECT * FROM pets WHERE id=$1', [req.params.id])
    .then(dataBaseRes => {
        if (dataBaseRes.rowCount === 0) {
            res.status(404)
            res.json({error:'no pet with this id'})
            return
        }
        res.json({pets:dataBaseRes.rows})
    })
    .catch(e => {
        console.log(e)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

petsRouter.delete("/:id", (req,res) => {

    db.query('DELETE FROM pets WHERE id=$1', [req.params.id])
    .then(dataBaseRes => {
        if (dataBaseRes.rowCount === 0) {
            res.status(404)
            res.json({error:'no pet with this id'})
            return
        }
        res.json({pets:dataBaseRes.rows})
    })
    .catch(e => {
        console.log(e)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

petsRouter.post("/", (req,res) => {
    if (!controller.isValidString(req.body.name)){
        res.status(400)
        res.json({error:'Invalid name'})
        return
    }
    if (!controller.isValidInt(req.body.age)){
        res.status(400)
        res.json({error:'Invalid age'})
        return
    }
    if (!controller.isValidString(req.body.type)){
        res.status(400)
        res.json({error:'Invalid type'})
        return
    }
    if (!controller.isValidString(req.body.breed)){
        res.status(400)
        res.json({error:'Invalid breed'})
        return
    }
    if (!controller.isValidBoolean(req.body.microchip)){
        res.status(400)
        res.json({error:'Invalid microchip'})
        return
    }
    const sql = {
        text: 'INSERT INTO pets(name,age,type,breed,microchip) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [req.body.name,req.body.age,req.body.type,req.body.breed,req.body.microchip]
    }
    db.query(sql.text,sql.values)
    .then(databaseRes => res.json({pets:databaseRes.rows}))
    .catch(e => {
        console.log(e)
        console.log(req.body.age)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

petsRouter.put("/:id", (req,res) => {
    if (!controller.isValidString(req.body.name)){
        res.status(400)
        res.json({error:'Invalid name'})
        return
    }
    if (!controller.isValidInt(req.body.age)){
        res.status(400)
        res.json({error:'Invalid age'})
        return
    }
    if (!controller.isValidString(req.body.type)){
        res.status(400)
        res.json({error:'Invalid type'})
        return
    }
    if (!controller.isValidString(req.body.breed)){
        res.status(400)
        res.json({error:'Invalid breed'})
        return
    }
    if (!controller.isValidBoolean(req.body.microchip)){
        res.status(400)
        res.json({error:'Invalid microchip'})
        return
    }
    const sql = {
        text: "UPDATE pets SET name=$1, age=$2, type=$3, breed=$4, microchip=$5 WHERE id=$6 RETURNING *",
        values: [req.body.name,req.body.age,req.body.type,req.body.breed,req.body.microchip,req.params.id]
    }
    db.query(sql.text,sql.values)
    .then(databaseRes => res.json({pets:databaseRes.rows}))
    .catch(e => {
        console.log(e)
        console.log(req.body.age)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

module.exports = petsRouter