//  REQUIRING DEPENDANCIES
require('dotenv').config();
const   express                 = require("express"),
        bodyParser              = require("body-parser"), 
        mongoose                = require("mongoose"), 
        methodOverride          = require("method-override"),
        flash                   = require("connect-flash");
        const app = express();

var indexRoutes                = require("./routes/index");

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);

//Starting Server on LocalHost 3000 (Test Phase)
var port = process.env.PORT || 3000; //PORT 3000 for localhost
app.listen(port, function(){
    console.log("Started server");
});