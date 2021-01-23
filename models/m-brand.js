const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
    brandName:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tblbrand', brandSchema);