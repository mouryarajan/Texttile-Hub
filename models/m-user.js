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
                    type: Schema.Types.ObjectId,
                    ref: 'tblproducts'
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
    },
    order: {
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
    role: {
        type: String,
        default: "Customer",
        required: true
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            product: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.product.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model('tbluser', userSchema);