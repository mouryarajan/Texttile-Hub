const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: false
        },
        lastName: {
            type: String,
            required: false
        }
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    otp: {
        type: Number,
        required: true,
    },
    address: {
        items: [
            {
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
            }
        ]
    },
    cart: {
        items: [
            {
                product: {
                    type: String,
                    required: false,
                },
                quantity: {
                    type: Number,
                    required: false
                }
            }
        ]
    },
    wishList: {
        items: [
            {
                product: {
                    type: String,
                    required: false,
                }
            }
        ]
    },
    recentItems: {
        items: [
            {
                product: {
                    type: String,
                    required: false,
                }
            }
        ]
    }
});

module.exports = mongoose.model('tbluser', userSchema);