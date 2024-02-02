const bodyParser = require('body-parser')
var express = require('express')
var app = express()
var path = require('path')

app.use(express.static(path.join(__dirname, '../public/')))
app.use(bodyParser.urlencoded({extended:true}))

var router = express.Router()
router.all('*', require('./routes/routes'))

require('./database')

app.use(router)
app.listen(80, () => {
    console.log("[SERVER] Server started!")
})
