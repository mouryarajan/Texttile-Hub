const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tbluser'
    },
    product: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    store: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: false
    },
    size: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    placeDate: {
        type: String,
        required: true
    },
    deliverDate: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: false
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    type:{
        type: String,
        required: false
    },
    street: {
        type: String,
        required: false,
    },
    landmark: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    pincode: {
        type: Number,
        required: false
    },
    is_cancel: {
        type: Boolean,
        required: true,
        default: false
    },
    phoneNumber: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('tblorder', orderSchema);