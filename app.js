const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ExpressError = require('./utils/expressError');
const Review = require('./models/review');
const campgrounds = require('./routes/campground');
const userRoutes = require('./routes/auth');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sessionConfig = {
    secret:'thisshouldbeasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname,'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/fakeuser',async (req,res)=>{
//     const user = new User({
//         email:'ishaan@gmail.com',
//         username:'ishu'
//     })
//     const newUser = await User.register(user,'chicken');
//     res.send(newUser);
// })
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home')
});
app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/reviews",reviews);
app.use("/",userRoutes);

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})
app.use((err,req,res,next) => {
    const {statusCode=500 , message="Something went wrong"} = err;
    res.status(statusCode).render('errors.ejs',{err}); 
});


app.listen(3000, () => {
    console.log('Serving on port 3000')
})
