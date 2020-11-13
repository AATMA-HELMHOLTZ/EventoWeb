//  REQUIRING DEPENDANCIES
require('dotenv').config();
var express                 = require("express");
var app                     = express();
var bodyParser              = require("body-parser");
var mongoose                = require("mongoose");
var User                    = require("./models/user");
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var methodOverride          = require("method-override");
var flash                   = require("connect-flash");
const { use }               = require("passport");

var indexRoutes = require("./routes/index");

app.use(express.static(__dirname + "/public"));             //Custom CSS + JS
app.use(methodOverride("_method"));
app.set("view engine", "ejs")                               //use .ejs as defualt extension
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//CONNECT MONGODB
mongoose.connect(process.env.url, {    
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
})
.then(() => console.log("connected to db"))
.catch(() => console.log(error.message));
mongoose.set('useFindAndModify', false);

//PASSPORT
app.use(require("express-session")({
    secret: "Rusty is the cutest", 
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//PASSING USER AND FLASH TO ALL ROUTES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);

//Starting Server on LocalHost 3000 (Test Phase)
var port = process.env.PORT || 3000; //PORT 3000 for localhost
app.listen(port, function(){
    console.log("Started server");
});