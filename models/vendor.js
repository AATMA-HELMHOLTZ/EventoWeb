var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



const VendorSchema = new mongoose.Schema({
    name: {type: String} ,
    img: {type: String, default: "https://scontent.fmaa1-3.fna.fbcdn.net/v/t1.0-9/p960x960/34091293_2917588961713177_4313699714257125376_o.png?_nc_cat=105&ccb=2&_nc_sid=7aed08&_nc_ohc=P7eSbYyi0CQAX_35toB&_nc_ht=scontent.fmaa1-3.fna&oh=3c38a05907e7a1546b6b356c5ab6e798&oe=5FD65337"},
    gallery: {type: Array, default: ["https://scontent.fmaa1-3.fna.fbcdn.net/v/t1.0-9/p960x960/34091293_2917588961713177_4313699714257125376_o.png?_nc_cat=105&ccb=2&_nc_sid=7aed08&_nc_ohc=P7eSbYyi0CQAX_35toB&_nc_ht=scontent.fmaa1-3.fna&oh=3c38a05907e7a1546b6b356c5ab6e798&oe=5FD65337", "https://scontent.fmaa1-3.fna.fbcdn.net/v/t1.0-9/p960x960/34091293_2917588961713177_4313699714257125376_o.png?_nc_cat=105&ccb=2&_nc_sid=7aed08&_nc_ohc=P7eSbYyi0CQAX_35toB&_nc_ht=scontent.fmaa1-3.fna&oh=3c38a05907e7a1546b6b356c5ab6e798&oe=5FD65337", "https://scontent.fmaa1-3.fna.fbcdn.net/v/t1.0-9/p960x960/34091293_2917588961713177_4313699714257125376_o.png?_nc_cat=105&ccb=2&_nc_sid=7aed08&_nc_ohc=P7eSbYyi0CQAX_35toB&_nc_ht=scontent.fmaa1-3.fna&oh=3c38a05907e7a1546b6b356c5ab6e798&oe=5FD65337"]},
    email: {type: String},
    number: {type:Number},
    ratings: {type: Array},
    city: {type: String, default: "Delhi"},
    service: {type:String},
    avgStar: {type:Number, default: 0},
    description: {type: String}
})


module.exports = mongoose.model("Vendor", VendorSchema);

