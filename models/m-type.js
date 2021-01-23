const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const typeSchema = new Schema({
    typeName:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tbltype', typeSchema);