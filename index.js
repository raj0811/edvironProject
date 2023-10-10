const express = require('express');
require('dotenv').config()
const port = 8009
const app = express()
const db=require('./db/mongoose')

app.use('/',require('./routes'))

app.listen(port,function(err){
    if(err){
        console.log(`Error in Connecting Server: ${err}`);
    }
    console.log(`Server is Running on PORT: ${port}`);
})