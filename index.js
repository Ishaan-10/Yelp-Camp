const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.listen(3000 , (req,res) =>{
    console.log("Listening on port 3000")
})
app.get('/',(req,res)=>{
    res.render("index.ejs");
})