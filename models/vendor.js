var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



const VendorSchema = new mongoose.Schema({
    name: {type: String} ,
    images: {type: Array},
    email: {type: String, unique:true},
    number: {type:Number, minlength:10, maxlength:10},
    ratings: {type: Array, default:[]},
    city: {type: String, default: "Delhi"},
    service: {type:String},
    avgStar: {type:Number, default: 0},
    minPrice: {type:Number},
    description: {type: String}
})


module.exports = mongoose.model("Vendor", VendorSchema);

