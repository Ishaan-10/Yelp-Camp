const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        //store url they request
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged in');
        return res.redirect('/login');
    }
    next();

}
module.exports.isAuthor = async (req,res,next)=>{

    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user.id)){
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{

    const {id , reviewid} = req.params;
    const review = await Review.findById(reviewid)
        if(!review.author.id===req.user.id){
            return res.redirect(`campgrounds/${id}`)
        }
    next();
}