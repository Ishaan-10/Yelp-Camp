const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
const passport = require('passport');
const {isLoggedIn , isAuthor} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage})
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocodding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocodding({accessToken:mapBoxToken});


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds})
});

router.get('/new',isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
router.post('',isLoggedIn, upload.array('image'),catchAsync(async (req, res,next) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user.id;
        campground.images = req.files.map(f => ({
            url:f.path,
            filename:f.filename
        }))
        const geoData = await geocoder.forwardGeocode({
            query:`${campground.location}`,
            limit:1
        }).send()
        const coordinates = geoData.body.features[0].geometry;
        campground.geometry = coordinates;
        await campground.save();
        console.log(campground);
        req.flash('success','Successfully made a new campground');
        res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', async (req, res,) => {
    const campground =await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    res.render('campgrounds/show', { campground });
});

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

router.put('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
});

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});
module.exports = router;