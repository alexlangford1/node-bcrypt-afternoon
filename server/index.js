const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const massive = require('massive')
const auth = require('./controller/auth')
const tc = require('./controller/treasure')
const authorize = require('./middleware/authMiddleware')
const { SESSION_SECRET, SERVER_PORT, CONNECTION_STRING } = process.env

app.use(bodyParser.json())

massive(CONNECTION_STRING).then((db) => {
    app.set('db', db)
    console.log('We chillin')
})

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))

app.post('/auth/register', auth.register)
app.post('/auth/login', auth.login)
app.get('/auth/logout', auth.logout)

app.get('/api/treasure/dragon', tc.dragonTreasure)
app.get('/api/treasure/user',  authorize.usersOnly, tc.getUserTreasure)
app.post('/api/treasure/user', authorize.usersOnly, tc.addUserTreasure)
app.get('/api/treasure/all', authorize.usersOnly, tc.getAllTreasure);




app.listen(SERVER_PORT, () => {
    console.log('bruhh', SERVER_PORT)
})