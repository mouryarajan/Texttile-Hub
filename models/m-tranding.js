const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trandingSchema = new Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tblproducts'
    },
    sold: {
        type: Number,
        required: false
    },
    cart: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('tbltranding', trandingSchema);