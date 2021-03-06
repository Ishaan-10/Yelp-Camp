const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const {isLoggedIn ,isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn,async (req,res) => {
    const camp = await Campground.findById(req.params.id)
    const {stars , review } = req.body;
    const newReview = new Review({ body:review , rating:stars});
    camp.reviews.push(newReview);
    newReview.author = req.user.id;
    await newReview.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp.id}/`)
});
router.delete('/:reviewid',isLoggedIn,isReviewAuthor, async (req,res)=>{
    const {id , reviewid} = req.params;
    const review = await Review.findByIdAndDelete(reviewid);
    const camp = await Campground.findByIdAndUpdate(id,{
        $pull:{reviews:reviewid}
    });
    res.redirect(`/campgrounds/${id}`);
})

module.exports = router; 