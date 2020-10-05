//  REQUIRING DEPENDANCIES
const   express                 = require("express"),
        bodyParser              = require("body-parser"), 
        mongoose                = require("mongoose"), 
        passport                = require("passport"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        localStrategy           = require("passport-local"), 
        methodOverride          = require("method-override"),
        User                    = require("./models/user"),
        Vendor                  = require("./models/vendor"), 
        flash                   = require("connect-flash"); 

 const app = express();

 var indexRoutes                = require("./routes/index");

app.use(express.static(__dirname + "/public"));             //Custom CSS + JS
app.use(methodOverride("_method"));
app.set("view engine", "ejs")                               //use .ejs as defualt extension

//CONNECT MONGODB
mongoose.connect('mongodb://localhost:27017/evento', {    
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log("connected to db"))
.catch(() => console.log(error.message));
mongoose.set('useFindAndModify', false);

//SETTING UP PASSPORTJS
app.use(require("express-session")({
    secret: "Rusty is the cutest", 
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);

//Starting Server on LocalHost 3000 (Test Phase)
var port = process.env.PORT || 3000; //PORT 3000 for localhost
app.listen(port, function(){
    console.log("Started server");
});