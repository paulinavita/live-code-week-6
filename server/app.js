require ('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongosee = require('mongoose')
const jwt = require ('jsonwebtoken')
const cors = require('cors')
const routes= require('./routes')

mongosee.connect(`mongodb://localhost/classic_fox_live_code_1`, {useNewUrlParser : true, useCreateIndex : true})

app
    .use(express.json())
    .use(express.urlencoded({extended : true}))
    .use(cors())

app.use('/', routes)
app.listen(port, () => {
    console.log('listening on', port)
})