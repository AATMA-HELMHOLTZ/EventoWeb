var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String, 
    password: String,
    img: 
    { 
        data: Buffer, 
        contentType: String,
        default: "/assets/default_img.png"
    },
    city: String, 
    email: String, 
    number: String,
    rating: Number
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

