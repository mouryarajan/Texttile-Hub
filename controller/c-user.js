const user = require('../models/m-user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const products = require('../models/m-products');
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');
//const fast2sms = require('fast-two-sms');

//Login 
exports.postLoginCheck = async (req, res, next) => {
    const phno = req.body.inputPhoneNumber;
    const password = req.body.inputPassword;
    if (!phno) return res.status(201).json({ status: false, message: "Enter Phone Number" });
    if (!password) return res.status(201).json({ status: false, message: "Enter Password" });
    try {
        const data = await user.findOne({ phoneNumber: phno }).select('name').select('phoneNumber').select('password');
        if (!data) return res.status(201).json({ status: false, message: "Phone Number or Password is Invalid!" });

        const validPassword = await bcrypt.compare(password, data.password);
        if (!validPassword) return res.status(201).json({ status: false, message: "invalid password!" });
        const token = jwt.sign({
            userId: data._id
        }, process.env.TOKEN_SECRET);
        arr = {
            firstName: data.name.firstName,
            lastName: data.name.lastName,
            phoneNumber: data.phoneNumber,
            image: data.image,
            authToken: token,
            address: data.address
        }
        res.status(200).json({
            status: true,
            data: arr,
        })
    } catch (err) {
        res.status(201).json({ err });
    }
};

//Registration
exports.postRegister = async (req, res, next) => {
    const phno = Number(req.body.inputPhoneNumber);
    const forResetPasswordFlag = req.body.forResetPasswordFlag || false;
    if (!phno) return res.status(201).json({ status: false, message: "Enter Phone Number" });

    try {
        if (!forResetPasswordFlag) {
            const data = await user.findOne({ phoneNumber: phno });
            if (data) return res.status(201).json({ status: false, message: "User Already Exist With This Phone Number!" });
        }
        const otp = Number(Math.floor(100000 + Math.random() * 900000));
        arr = {
            otp: otp
        }
        // let sms = "Your Ecommerce Otp is" + otp.toString() + "please don't share it with others" 
        // let resp = await fast2sms.sendMessage({authorization: uL52IUqO6JQ1cjToHykehX3ENSdlpsZn7WYitD8xr40gFmAfKRK0tXQMjrvAbeCpWnhV9EyclPZ4zxR7, message:sms, numbers: [phno]});
        // console.log(resp);
        res.status(200).json({
            status: true,
            data: arr
        })
    } catch (err) {
        res.status(201).json({ err });
    }

}

//Password Adding
exports.postPassword = async (req, res, next) => {
    const phno = Number(req.body.inputPhoneNumber);
    const password = req.body.inputPassword;
    if (!phno) return res.status(201).json({ status: false, message: "Enter Phone Number" });
    if (!password) return res.status(201).json({ status: false, message: "Enter Password" });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const data = await user.findOne({ phoneNumber: phno });
        if (data) {
            data.password = hashPassword
            data.save()
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            status: true
                        })
                    } else {
                        res.status(201).json({
                            status: false
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
        } else {
            const User = new user({
                phoneNumber: phno,
                password: hashPassword
            });
            User.save()
                .then(data => {
                    if (data) {
                        const token = jwt.sign({
                            userId: data._id
                        }, process.env.TOKEN_SECRET);
                        arr = {
                            phoneNumber: phno,
                            authToken: token
                        }
                        res.status(200).json({
                            status: true,
                            data: arr
                        })
                    } else {
                        res.status(201).json({
                            status: false
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
        }
    } catch (err) {
        res.status(201).json({ err });
    }
}

//Edit User
exports.postEditUser = (req, res, next) => {
    const d = req.body;
    const phno = Number(d.inputPhoneNumber);
    const id = d.inputUserId;
    user.findById(id)
        .then(result => {
            if (result) {
                result.name.firstName = d.inputFirstName;
                result.name.lastName = d.inputLastName;
                result.phoneNumber = phno;
                result.gender = d.inputGender;
                result.email = d.inputEmail;
                result.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({
                                status: true
                            })
                        } else {
                            res.status(201).json({
                                status: false,
                                message: "Something went wrong"
                            })
                        }
                    }).catch(err => { console.log(err) });
            } else {
                res.status(201).json({
                    status: false,
                    message: "User not found"
                })
            }
        }).catch(err => { console.log(err) });
}

//Add Product to cart
exports.postCart = (req, res, next) => {
    const userId = req.body.inputUserId;
    const productId = req.body.inputProductId;
    const productSize = req.body.inputProductsize;
    const productColor = req.body.inputProductColor;
    const productQuantity = req.body.inputProductQuantity;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });
    if (!productQuantity) return res.status(201).json({ status: false, message: "Enter Product Quantity" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                products.findById(productId)
                    .then(prod => {
                        if (prod) {
                            if (prod.quantity >= 1) {
                                if (prod.type == "Saree") {
                                    if (prod.colorFlag) {
                                        let arr = users.cart.items;
                                        let fprice = prod.price;
                                        if (productQuantity > 1) {
                                            fprice = productQuantity * prod.price;
                                        }
                                        arr.push({
                                            product: prod._id,
                                            quantity: productQuantity,
                                            color: productColor,
                                            name: prod.name,
                                            image: prod.images,
                                            price: fprice
                                        });
                                        users.cart.items = arr;
                                        users.save()
                                            .then(data => {
                                                if (data) {
                                                    res.status(200).json({
                                                        status: true
                                                    });
                                                } else {
                                                    res.status(201).json({
                                                        status: false,
                                                        message: "Something went wrong"
                                                    });
                                                }
                                            }).catch(err => { console.log(err) });
                                    } else {
                                        let arr = users.cart.items;
                                        let fprice = prod.price;
                                        if (productQuantity > 1) {
                                            fprice = productQuantity * prod.price;
                                        }
                                        arr.push({
                                            product: prod._id,
                                            quantity: productQuantity,
                                            name: prod.name,
                                            image: prod.images,
                                            price: fprice
                                        });
                                        users.cart.items = arr;
                                        users.save()
                                            .then(data => {
                                                if (data) {
                                                    res.status(200).json({
                                                        status: true
                                                    });
                                                } else {
                                                    res.status(201).json({
                                                        status: false,
                                                        message: "Something went wrong"
                                                    });
                                                }
                                            }).catch(err => { console.log(err) });
                                    }
                                } else {
                                    let s;
                                    if (productSize == "s") { s = prod.s }
                                    if (productSize == "m") { s = prod.m }
                                    if (productSize == "l") { s = prod.l }
                                    if (productSize == "xl") { s = prod.xl }
                                    if (productSize == "xxl") { s = prod.xxl }
                                    if (productSize == "xxxl") { s = prod.xxxl }
                                    if (s >= 1) {
                                        if (prod.colorFlag) {
                                            let arr = users.cart.items;
                                            let fprice = prod.price;
                                            if (productQuantity > 1) {
                                                fprice = productQuantity * prod.price;
                                            }
                                            arr.push({
                                                product: prod._id,
                                                quantity: productQuantity,
                                                color: productColor,
                                                size: productSize,
                                                name: prod.name,
                                                image: prod.images,
                                                price: fprice
                                            });
                                            users.cart.items = arr;
                                            users.save()
                                                .then(data => {
                                                    if (data) {
                                                        res.status(200).json({
                                                            status: true
                                                        });
                                                    } else {
                                                        res.status(201).json({
                                                            status: false,
                                                            message: "Something went wrong"
                                                        });
                                                    }
                                                }).catch(err => { console.log(err) });
                                        } else {
                                            let arr = users.cart.items;
                                            let fprice = prod.price;
                                            if (productQuantity > 1) {
                                                fprice = productQuantity * prod.price;
                                            }
                                            arr.push({
                                                product: prod._id,
                                                quantity: productQuantity,
                                                size: productSize,
                                                name: prod.name,
                                                image: prod.images,
                                                price: fprice
                                            });
                                            users.cart.items = arr;
                                            users.save()
                                                .then(data => {
                                                    if (data) {
                                                        res.status(200).json({
                                                            status: true
                                                        });
                                                    } else {
                                                        res.status(201).json({
                                                            status: false,
                                                            message: "Something went wrong"
                                                        });
                                                    }
                                                }).catch(err => { console.log(err) });
                                        }
                                    } else {
                                        res.status(201).json({
                                            status: false,
                                            message: "Size is not in stock"
                                        });
                                    }
                                }
                            } else {
                                res.status(201).json({
                                    status: false,
                                    message: "Out of stock"
                                });
                            }
                        } else {
                            res.status(201).json({ status: false, message: "Product not found" });
                        }
                    }).catch(err => { console.log(err) });
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
};

//increase product quantity
exports.postIncreaseQuantity = (req, res, next) => {
    const pid = req.body.inputProductId;
    const status = req.body.inputStatus;
    if (!pid) return res.status(201).json({ status: false, message: "Enter Product Id" });
    let id;
    decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    user.findOne({ _id: id })
        .then(result => {
            let cart = users.cart.items;
            for (let n of cart) {
                
            }
        })
}

//Get Cart
exports.postGetCart = (req, res, next) => {
    let id;
    decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: id })
        .then(users => {
            if (users) {
                let doo = users.cart.items;
                let total = 0;
                let count = 0;
                arr = [];
                for (let n of doo) {
                    total = total + n.price;
                    count = count + 1;
                    arr.push({
                        product: n.product,
                        name: n.name,
                        image: n.image,
                        quantity: n.quantity,
                        size: n.size,
                        color: n.color,
                        price: n.price,
                        total: total,
                        count: count
                    })
                }
                res.status(200).json({
                    status: true,
                    data: arr
                })
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Remove from cart
exports.postRemoveProductFromCart = (req, res, next) => {
    const userId = req.body.inputUserId;
    const productId = req.body.inputProductId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                return users.removeFromCart(productId);
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        })
        .then(result => {
            if (result) {
                res.status(200).json({ status: true })
            } else {
                res.status(201).json({ status: false, message: "Remove from cart failed" });
            }
        }).catch(err => { console.log(err) });
};

//Clear Cart
exports.postClearCart = (req, res, next) => {
    const userId = req.body.inputUserId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                return users.clearCart();
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        })
        .then(result => {
            if (result) {
                res.status(200).json({ status: true })
            } else {
                res.status(201).json({ status: false, message: "Clear cart failed" });
            }
        }).catch(err => { console.log(err) });
}

//Add Address
exports.postAddress = async (req, res, next) => {
    const userId = req.body.inputUserId;
    const d = req.body;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    user.findOne({ _id: userId })
        .then(result => {
            if (result) {
                let arr = result.address.items;
                arr.push({
                    type: d.inputType,
                    street: d.inputStreet,
                    landmark: d.inputLandmark,
                    city: d.inputCity,
                    state: d.inputState,
                    pincode: d.inputPincode
                });
                result.address.items = arr;
                result.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({
                                status: true
                            })
                        } else {
                            res.status(201).json({
                                status: false,
                                message: "Something went worng"
                            })
                        }
                    }).catch(err => { console.log(err); });
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err); });
}

//Remove Address
exports.postRemoveAddress = (req, res, next) => {
    const userId = req.body.inputUserId;
    const addressId = req.body.inputAddressId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!addressId) return res.status(201).json({ status: false, message: "Enter Address Id" });

    user.findOne({ _id: userId })
        .then(result => {
            if (result) {
                let data = result.address.items;
                if (isEmptyObject(data)) {
                    result.status(201).json({
                        status: "false",
                        message: "You don't have any Address"
                    })
                } else {
                    let arr = [];
                    for (let n of data) {
                        if (n._id != addressId) {
                            arr.push({
                                type: n.type,
                                street: n.street,
                                landmark: n.landmark,
                                city: n.city,
                                state: n.state,
                                pincode: n.pincode
                            })
                        }
                    }
                    result.address.items = arr;
                    result.save()
                        .then(s => {
                            res.status(201).json({
                                message: "Address Removed Sucessfuly",
                                status: true
                            })
                        })
                        .catch(err => { console.log(err) });
                }
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err); });
}
//Get Addrewss
exports.postGetAddress = (req, res, next) => {
    const userId = req.body.inputUserId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                res.status(200).json({
                    status: true,
                    data: users.address.items
                })
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Wish List
exports.postAddWishlist = (req, res, next) => {
    const userId = req.body.inputUserId;
    const productId = req.body.inputProductId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: userId })
        .then(result => {
            if (result) {
                products.findById(productId)
                    .then(prod => {
                        if (prod) {
                            let arr = result.wishList.items;
                            arr.push({
                                product: productId,
                                name: prod.name,
                                image: prod.images,
                                price: prod.price
                            })
                            result.wishList.items = arr;
                            result.save()
                                .then(data => {
                                    if (data) {
                                        res.status(200).json({ status: true, message: "Product added to wish list" });
                                    } else {
                                        res.status(201).json({ status: false, message: "Something went wrong" });
                                    }
                                }).catch(err => { console.log(err) });
                        } else {
                            res.status(201).json({ status: false, message: "Product not found" });
                        }
                    }).catch(err => { console.log(err) });
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Remove from wish list
exports.postRemoveProductWishList = (req, res, next) => {
    const userId = req.body.inputUserId;
    const productId = req.body.inputProductId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                return users.removeFromWishList(productId);
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        })
        .then(result => {
            if (result) {
                res.status(200).json({ status: true })
            } else {
                res.status(201).json({ status: false, message: "Remove from wish list failed" });
            }
        }).catch(err => { console.log(err) });
};

//Clear Wishlist
exports.postClearWishList = (req, res, next) => {
    const userId = req.body.inputUserId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                return users.clearWishList();
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        })
        .then(result => {
            if (result) {
                res.status(200).json({ status: true })
            } else {
                res.status(201).json({ status: false, message: "Clear WishList failed" });
            }
        }).catch(err => { console.log(err) });
}

//Recent List
exports.postGetWishList = (req, res, next) => {
    const userId = req.body.inputUserId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                res.status(200).json({
                    status: true,
                    data: users.wishList.items
                })
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Add Recent Product
exports.postRecentItems = (req, res, next) => {
    const userId = req.body.inputUserId;
    const productId = req.body.inputProductId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: userId })
        .then(result => {
            if (result) {
                products.findById(productId)
                    .then(prod => {
                        if (prod) {
                            let arr = result.recentItems.items;
                            var im = prod.images.split(',');
                            var fim = im[0];
                            arr.push({
                                product: productId,
                                name: prod.name,
                                image: fim,
                                price: prod.price
                            })
                            result.recentItems.items = arr;
                            result.save()
                                .then(data => {
                                    if (data) {
                                        res.status(200).json({ status: true, message: "Product added to recent list" });
                                    } else {
                                        res.status(201).json({ status: false, message: "Something went wrong" });
                                    }
                                }).catch(err => { console.log(err) });
                        } else {
                            res.status(201).json({ status: false, message: "Product not found" });
                        }
                    }).catch(err => { console.log(err) });
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Recent List
exports.postGetRecentList = (req, res, next) => {
    const userId = req.body.inputUserId;
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    console.log(req.headers.token);
    decodeDataFromAccessToken(req.headers.token).then((data) => {
        console.log(data);
    })
    user.findOne({ _id: userId })
        .limit(5)
        .then(users => {
            if (users) {
                res.status(200).json({
                    status: true,
                    data: users.recentItems.items
                })
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Add Order

