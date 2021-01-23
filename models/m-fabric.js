const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fabricSchema = new Schema({
    fabricName:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tblfabric', fabricSchema);