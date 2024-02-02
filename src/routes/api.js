const path = require('path');

var express = require('express')
var router = express.Router();
var db = require('../database')

router.get('/products', (req, res) => {
    db.getProducts(10, (data) => {
        res.send(data)
    })    
})

router.post('/products/create/', (req, res) => {
    const obj = req.query;

    //TODO: Better object check :D
    if(check(obj['name']) || check(obj['price']) || check(obj['quantity']) || check(obj['description']))
        return res.send({res: -1, message: "Missing information."});

    db.createProduct(obj, (data) => { 
        console.log("[API] " + data)
    })

    res.send(200);
})

module.exports = router;

function check(st)
{
    return (st == null || st.trim() === '')
}