const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    companyEmail: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String,
        required: true
    },
    panNumber: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    bankDetail: {
        accountNumber: {
            type: Number,
            required: false
        },
        accountName: {
            type: String,
            required: false
        },
        ifscCode: {
            type: String,
            required: false
        },
        bankName: {
            type: String,
            required: false
        }
    },
    storeType: {
        type: String,
        required: false,
    },
    alternatePhoneNumber: {
        type: Number,
        required: false,
    },
    address: {
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
        }
    },
    document:{
        panCard: {
            type: String,
            required: false
        },
        gstCard: {
            type: String,
            required: false
        },
        cancelCheck: {
            type: String,
            required: false
        }
    },
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tbluser'
    },
    storeImage: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tblstore', storeSchema);