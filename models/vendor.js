var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



const VendorSchema = new mongoose.Schema({
    name: {type: String} ,
    minPrice: {type: Number},
    image: {type: String},
    email: {type: String},
    phone: {type:Number},
    review: {type:String},
    rating: {type: Number},
    city: {type: String},
    password: {type: String}
})

VendorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Vendor", VendorSchema);

