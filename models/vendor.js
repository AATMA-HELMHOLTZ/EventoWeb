var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



const VendorSchema = new mongoose.Schema({
    name: {type: String} ,
    images: {type: Array},
    email: {type: String},
    number: {type:Number},
    ratings: {type: Array},
    city: {type: String, default: "Delhi"},
    service: {type:String},
    avgStar: {type:Number, default: 0},
    description: {type: String}
})


module.exports = mongoose.model("Vendor", VendorSchema);

