const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    images:{
        items: [
            {
                image:{
                    type: String,
                    required: false
                }
            }
        ]
    },
    name: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tblcategory'
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: false
    },
    fabric: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    catologue: {
        type: String,
        required: false
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tblstore'
    }
});

module.exports = mongoose.model('tblproducts', productSchema);