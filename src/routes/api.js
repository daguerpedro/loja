const path = require('path');

var express = require('express')
var router = express.Router();
var db = require('../database')

const rateLimit = require('express-rate-limit');

const r_products = rateLimit({
	windowMs: 60 * 1000,
	limit: 30, // Limit each IP to 30 requests per `windowMS` ( Here, 1 minute )
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})

router.get('/products', r_products, (req, res) => {
    db.getProducts(10, (data) => {
        res.send(data)
    })    
})

router.post('/products/create/', (req, res) => {
    if(!req.session.admin) 
    {
        res.sendStatus(403)
        return;
    }

    const obj = req.query;

    //TODO: Better object check :D
    if(check(obj['name']) || check(obj['price']) || check(obj['quantity']) || check(obj['description']))
        return res.send({res: -1, message: "Missing information."});

    db.createProduct(obj, (data) => { 
        console.log("[API] " + data)
    })

    res.sendStatus(200);
})

module.exports = router;

function check(st)
{
    return (st == null || st.trim() === '')
}