var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



const VendorSchema = new mongoose.Schema({
    name: {type: String} ,
    img: {type: String},
    email: {type: String},
    number: {type:Number},
    ratings: {type: Array},
    city: {type: String},
    service: {type:String},
    description: {type: String}
})


module.exports = mongoose.model("Vendor", VendorSchema);

