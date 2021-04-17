const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
const passport = require('passport');
const {isLoggedIn} = require('../middleware');

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds})
});

router.get('/new',isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
router.post('',isLoggedIn, catchAsync(async (req, res,next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success','Successfully made a new campground');
        res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground, });
});
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

router.put('/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

router.delete('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});
module.exports = router;