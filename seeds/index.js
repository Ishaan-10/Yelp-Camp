const Campground = require('../models/campground');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected")
});

const sample = (array) =>{
  return array[Math.floor(Math.random() * array.length)]
}
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000+1)
        const camp = new Campground({
          location: `${cities[random1000].city},${cities[random1000].state}`,
          title:`${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}
seedDB().then(()=>{
  mongoose.connection.close();
})
