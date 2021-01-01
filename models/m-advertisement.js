const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const advertisementSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    product: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    store: {
        type: String,
        required: false
    },
    sname: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tbladvertisement', advertisementSchema);