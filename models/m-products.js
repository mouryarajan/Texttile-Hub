const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    images: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    brandName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tblbrand'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tblcategory'
    },
    price: {
        type: Number,
        required: true
    },
    colorFlag: {
        type: Boolean,
        required: false
    },
    primarycolor: {
        type: String,
        required: false
    },
    colors: {
        items: [
            {
                color: {
                    type: String,
                    required: false
                },
                image: {
                    type: String,
                    required: false
                }
            }
        ]
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbltype'
    },
    s: {
        type: Number,
        required: false
    },
    m: {
        type: Number,
        required: false
    },
    l: {
        type: Number,
        required: false
    },
    xl: {
        type: Number,
        required: false
    },
    xxl: {
        type: Number,
        required: false
    },
    xxxl: {
        type: Number,
        required: false
    },
    quantity: {
        type: Number,
        required: true
    },
    fabric: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tblfabric'
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
        ref: 'tblstores'
    },
    review: {
        items: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'tbluser'
                },
                name: {
                    type: String,
                    required: false
                },
                description: {
                    type: String,
                    required: false
                },
                rating: {
                    type: Number,
                    required: false
                }
            }
        ]
    }
});

module.exports = mongoose.model('tblproducts', productSchema);