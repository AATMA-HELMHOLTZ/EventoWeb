var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, default:'User'},
    email: {type: String,
        required: true,
        unique: true,
        // match: /\S+@\S+\.\S+/
    },
    password: {type: String, required: true, minlength: 6},
    mobile: {type: Number, required:false, minlength:10 },
    city: {type: String, default:'Delhi'},
    // prevOreder: [{ref: order}]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

