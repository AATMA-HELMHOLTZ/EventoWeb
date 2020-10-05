var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");


var VendorSchema = new mongoose.Schema({
    name: String, 
    password: String,
    service: String, 
    description: String,
    display_picture: 
    { 
        data: Buffer, 
        contentType: String,
        default: "/assets/default_img.png"
    },
    cities: Array, 
    email: String, 
    number: String,
    rating: Number
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Vendor", VendorSchema);

