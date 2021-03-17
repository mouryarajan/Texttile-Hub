const mongoose = require('mongoose');
const {isDefined} = require('../handler/common');
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
    image: {    
        type: String,
        required: false
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
        required: false,
    },
    gender: {
        type: String,
        required: false
    },
    email :{
        type: String,
        required: false
    },
    address: {
        items: [
            {
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
                }
            }
        ]
    },
    cart: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'tblproducts'
                },
                name:{
                    type: String,
                    required: false
                },
                image: {
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
                price: {
                    type: Number,
                    required: false
                },
                description: {
                    type: String,
                    required: false
                },
                storeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'tblstores'
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
                },
                name:{
                    type: String,
                    required: false
                },
                image: {
                    type: String,
                    required: false
                },
                price: {
                    type: Number,
                    required: false
                }
            }
        ]
    },
    recentItems: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'tblproducts'
                },
                name:{
                    type: String,
                    required: false
                },
                image: {
                    type: String,
                    required: false
                },
                price: {
                    type: Number,
                    required: false
                }
            }
        ]
    },
    role: {
        type: String,
        default: "Customer",
        required: true
    },
    storeRequest: {
        type: Boolean,
        default: false,
        required: true
    },
    storeStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    otpToken: {
        type: String,
        required: false
    }
});

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.product.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.removeFromWishList = function (productId) {
    const updatedCartItems = this.wishList.items.filter(item => {
        return item.product.toString() !== productId.toString();
    });
    this.wishList.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

userSchema.methods.clearWishList = function () {
    this.wishList = { items: [] };
    return this.save();
};

module.exports = mongoose.model('tbluser', userSchema);