const express = require('express')
const db = require('../utils/database')

const booksRouter = express.Router()

booksRouter.get("/", (req,res) => {


    db.query('SELECT * FROM books WHERE author=$1',['Kim Hand'])
    .then(dataBaseRes => res.json({books:dataBaseRes.rows}))
    .catch(e => {
        console.log(e)
        res.status(500)
        res.json({error:'Unexpected Error'})
    })
})

module.exports = booksRouter