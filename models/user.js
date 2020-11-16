var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, default:'User'},
    username: {type: String}, // Email
    password: {type: String},
    mobile: {type: Number, required:false, minlength:10, maxlength:10 },
    city: {type: String, default:'Delhi'},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    orders: {type: Array, default:[]},
    img: {type: String, default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"}
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

