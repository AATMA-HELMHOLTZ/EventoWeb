var mongoose = require("mongoose");

var TemplateSchema = new mongoose.Schema({
    birthday: Array, 
    anniversary: Array,
    farewell: Array,
    tedx: Array,
    festive: Array
})

module.exports = mongoose.model("Template", TemplateSchema);

