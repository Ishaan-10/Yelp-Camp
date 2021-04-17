const User = require('../models/user');
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/register',(req,res)=>{
    res.render('auth/register')
})

router.post('/register' , async (req,res)=>{
    try{
        const { email , username ,password} = req.body;
        const user = new User({email,username});
        const newUser = await User.register(user, password);
        req.login(newUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to YELP');
            res.redirect('/campgrounds')
        });
    }catch(e){
        res.send(e);
    }
})

router.get('/login',(req,res)=>{
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) ,(req,res)=>{
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/campgrounds');
})

module.exports = router;