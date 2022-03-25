const express = require('express')
const db = require('../utils/database')

const petsRouter = express.Router()

petsRouter.get("/", (req,res) => {


    db.query('SELECT * FROM pets')
    .then(dataBaseRes => res.json({pets:dataBaseRes.rows}))
    .catch(e => {
        console.log(e)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

petsRouter.get("/:id", (req,res) => {

    db.query('SELECT * FROM pets WHERE id=$1', [req.params.id])
    .then(dataBaseRes => {
        if (dataBaseRes.rows.length === 0) {
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

module.exports = petsRouter