const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
    brandid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tblbrand'
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbluser'
    }
});

module.exports = mongoose.model('tblbrandstore', brandSchema);