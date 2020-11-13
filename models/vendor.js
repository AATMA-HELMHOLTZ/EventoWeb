var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



const VendorSchema = new mongoose.Schema({
    name: {type: String} ,
    img: {type: String},
    gallery: {type: Array},
    email: {type: String},
    number: {type:Number},
    ratings: {type: Array},
    city: {type: String},
    service: {type:String},
    avgStar: {type:Number},
    description: {type: String}
})


module.exports = mongoose.model("Vendor", VendorSchema);

