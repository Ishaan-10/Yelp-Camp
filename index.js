const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const app = express();
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(methodOverride('_method')); //For post requests

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected")
});

const path = require('path');
const campground = require('./models/campground');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.listen(3000 , (req,res) =>{
    console.log("Listening on port 3000")
})

//HOME PAGE
app.get('/',(req,res)=>{
    res.render("index.ejs");
})

//Campgrounds
app.get('/campgrounds/',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds});
})

//Make new campground
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new.ejs');
})

// Post request for making new campground
app.use(express.urlencoded({ extended: true }));
app.post('/campgrounds/' ,async (req,res)=>{
    const data = await req.body;
    const newCamp = new Campground(data);
    await newCamp.save();
    res.redirect('/campgrounds/');
})

// Delete campground
app.delete('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

//Detailed Camp View
app.get('/campgrounds/:id/',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/camp.ejs',{camp});
})

// Edit form
app.get('/campgrounds/:id/edit',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{camp});
})
// Edit form patch
app.patch('/campgrounds/:id',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body);
    res.redirect(`/campgrounds/${camp.id}/`)
})




