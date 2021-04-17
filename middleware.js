module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        //store url they request
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged in');
        return res.redirect('/login');
    }
    next();

}
