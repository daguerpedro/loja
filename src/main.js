require('dotenv').config()
var express = require('express')
var path = require('path')


// Session storage
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const store = new KnexSessionStore(); // sqlite3 database

// Request Parser
const bodyParser = require('body-parser')

var app = express()
app.use(express.static(path.join(__dirname, '../public/')))
app.use(bodyParser.urlencoded({ extended: true }))

// Initialize session storage.
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: store,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
    }),
)

var router = express.Router()
router.all('*', require('./routes/routes'))

require('./database')

app.use(router)
app.listen(process.env.PORT, () => {
    console.log("[SERVER] Server started!")

    setInterval(() => {
        store.clear().then((length) => {
            console.log(`[SERVER] Cleared ${JSON.stringify(length)} sessions`);
        });
    }, 3 * (24 * 60 * 60 * 1000)); // Every 3 days
})