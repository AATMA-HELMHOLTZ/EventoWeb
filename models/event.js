var mongoose                = require("mongoose");

var EventSchema = new mongoose.Schema({
    name: String,
    vendors: Array,
    city: String,
})

module.exports = mongoose.model("Event", EventSchema);

