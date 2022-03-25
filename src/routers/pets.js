const express = require('express')
const db = require('../utils/database')

const petsRouter = express.Router()

const hasAtLeastOneQuery = queryCount => queryCount>0

const handleWhereQuery = (baseQuery,queries,values) => {
    let whereQuery = ' WHERE'
    let queryCount = 0
    for (key in queries){
        if (queries[key]){
            if (hasAtLeastOneQuery(queryCount)){
                whereQuery += ' AND'
            }
            queryCount++
            whereQuery += ` ${key}=$${queryCount}`
            values.push(queries[key])
        }
    }
    if (hasAtLeastOneQuery(queryCount)) baseQuery += whereQuery
    return baseQuery
}

petsRouter.get("/", (req,res) => {
    const baseQuery = 'SELECT * FROM pets'
    const values = []
    const whereQuery = handleWhereQuery(baseQuery,req.query,values)
    db.query(whereQuery,values)
    .then(dataBaseRes => {
        console.log(dataBaseRes)
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