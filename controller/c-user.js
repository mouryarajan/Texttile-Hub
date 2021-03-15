const user = require('../models/m-user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const products = require('../models/m-products');
const tranding = require('../models/m-tranding');
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');
const loadash = require("lodash");
const { populate } = require('../models/m-user');
//const fast2sms = require('fast-two-sms');

//Login 
exports.postLoginCheck = async (req, res, next) => {
    const phno = req.body.inputPhoneNumber;
    const password = req.body.inputPassword;
    if (!phno) return res.status(201).json({ status: false, message: "Enter Phone Number" });
    if (!password) return res.status(201).json({ status: false, message: "Enter Password" });
    try {
        const data = await user.findOne({ phoneNumber: phno }).select('name').select('phoneNumber').select('password').select('role').select('email').select('gender').select('image storeRequest');
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
            role: data.role,
            email: data.email,
            gender: data.gender,
            authToken: token,
            storeRequest: data.storeRequest,
            image: data.image,
            storeStatus: data.storeStatus
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
             otp
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
                .then(data => {
                    if (data) {
                        const token = jwt.sign({
                            userId: data._id
                        }, process.env.TOKEN_SECRET);
                        arr = {
                            firstName: data.name.firstName,
                            lastName: data.name.lastName,
                            phoneNumber: data.phoneNumber,
                            email: data.email,
                            phoneNumber: phno,
                            authToken: token,
                            role: data.role,
                            storeRequest: data.storeRequest,
                            image: data.image,
                            storeStatus: data.storeStatus
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
                            firstName: data.name.firstName,
                            lastName: data.name.lastName,
                            phoneNumber: data.phoneNumber,
                            email: data.email,
                            phoneNumber: phno,
                            authToken: token,
                            role: data.role,
                            storeRequest: data.storeRequest,
                            image: data.image,
                            storeStatus: data.storeStatus
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
exports.postEditUser = async (req, res, next) => {
    const d = req.body;
    let id = null;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        if(data){
            id = data.userId;
        }
    })
    if (id === null) return res.status(201).json({ status: false, message: "Unauthorised user" });
    user.findById(id)
        .then(result => {
            if (result) {
                result.name.firstName = d.inputFirstName;
                result.name.lastName = d.inputLastName;
                result.gender = d.inputGender;
                result.email = d.inputEmail;
                result.image = d.inputImage;
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
exports.postCart = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    const productId = req.body.inputProductId;
    const productSize = req.body.inputProductsize;
    const productColor = req.body.inputProductColor;
    const productQuantity = req.body.inputProductQuantity;
    const productPrice = req.body.inputProductPrice;
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });
    if (!productQuantity) return res.status(201).json({ status: false, message: "Enter Product Quantity" });

    user.findOne({ _id: id })
        .then(users => {
            if (users) {
                products.findById(productId).populate('brandName').populate('category').populate('type').populate('fabric')
                    .then(async prod => {
                        if (prod) {
                            if (prod.quantity >= 1) {
                                const trand = await tranding.findOne({ productId: prod._id });
                                if (trand) {
                                    trand.cart = trand.cart + 1;
                                    trand.save();
                                } else {
                                    trands = new tranding({
                                        productId: prod._id,
                                        cart: 1
                                    })
                                    trands.save();
                                }
                                if (prod.category.name.toLowerCase() == "saree") {
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
                                            image: req.body.inputImage,
                                            price: productPrice,
                                            storeId: prod.storeId,
                                            size: productSize,
                                            description: prod.description
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

                                        fprice = productQuantity * prod.price;

                                        arr.push({
                                            product: prod._id,
                                            quantity: productQuantity,
                                            name: prod.name,
                                            color: productColor,
                                            image: req.body.inputImage,
                                            price: productPrice,
                                            storeId: prod.storeId,
                                            size: productSize,
                                            description: prod.description
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
                                    let produ = productSize.toLowerCase();
                                    if (produ.toLowerCase() == "s") { s = prod.s.quantity }
                                    if (produ.toLowerCase() == "m") { s = prod.m.quantity }
                                    if (produ.toLowerCase() == "l") { s = prod.l.quantity }
                                    if (produ.toLowerCase() == "xl") { s = prod.xl.quantity }
                                    if (produ.toLowerCase() == "xxl") { s = prod.xxl.quantity }
                                    if (produ.toLowerCase() == "xxxl") { s = prod.xxxl.quantity }
                                    if (s >= Number(productQuantity)) {
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
                                                image: req.body.inputImage,
                                                price: productPrice,
                                                storeId: prod.storeId,
                                                size: productSize,
                                                description: prod.description
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
                                                color: productColor,
                                                image: req.body.inputImage,
                                                price: productPrice,
                                                storeId: prod.storeId,
                                                size: productSize,
                                                description: prod.description
                                            });
                                            users.cart.items = arr;
                                            users.save()
                                                .then(data => {
                                                    trand.save();
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
exports.postIncreaseQuantity = async (req, res, next) => {
    const pid = req.body.inputProductId;
    const status = req.body.inputStatus;
    if (!pid) return res.status(201).json({ status: false, message: "Enter Product Id" });
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    user.findOne({ _id: id })
        .then(result => {
            let cart = result.cart.items;
            let arr = [];
            for (let n of cart) {
                if (n.product == pid) {
                    if (status) {
                        let aprice = n.price / n.quantity;
                        n.quantity = n.quantity + 1;
                        n.price = n.quantity * aprice;
                    } else {
                        if (n.quantity > 1) {
                            let aprice = n.price / n.quantity;
                            n.quantity = n.quantity - 1;
                            n.price = n.quantity * aprice;
                        } else {
                            break;
                        }
                    }
                    arr.push(n);
                }
            }
            result.cart.items = arr;
            result.save()
                .then(d => {
                    res.status(200).json({
                        status: true
                    })
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}

//Get Cart
exports.postGetCart = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    user.findOne({ _id: id })
        .populate({
            path: 'cart',
            populate: {
                path: 'items',
                populate: {
                    path: 'product',
                    model: 'tblproducts',
                    populate: {
                        path: 'brandName',
                        model: 'tblbrand'
                    },
                    populate: {
                        path: 'storeId',
                        model: 'tblstores'
                    }
                }
            }
        })
        .then(async users => {
            if (users) {
                let doo = users.cart.items;
                //console.log(doo);
                let count = 0;
                let arr = [];
                for (let n of doo) {
                    count = count + 1;
                    let stock = true;
                    if (Number(n.product.quantity) <= 0) {
                        stock = false;
                    }
                    if (n.size) {
                        if (n.size == 's') {
                            if (n.product.s < n.quantity) {
                                stock = false;
                            }
                        }
                        if (n.size == 'm') {
                            if (n.product.m < n.quantity) {
                                stock = false;
                            }
                        }
                        if (n.size == 'l') {
                            if (n.product.l < n.quantity) {
                                stock = false;
                            }
                        }
                        if (n.size == 'xl') {
                            if (n.product.xl < n.quantity) {
                                stock = false;
                            }
                        }
                        if (n.size == 'xxl') {
                            if (n.product.xxl < n.quantity) {
                                stock = false;
                            }
                        }
                        if (n.size == 'xxxl') {
                            if (n.product.xxxl < n.quantity) {
                                stock = false;
                            }
                        }
                    }
                    arr.push({
                        product: n.product._id,
                        name: n.name,
                        image: n.image,
                        quantity: n.quantity,
                        size: n.size,
                        color: n.color,
                        price: n.price,
                        description: n.product.description,
                        brandName: n.product.brandName.brandName,
                        primaryColor: n.product.primarycolor,
                        stock: stock,
                        storeId: n.product.storeId._id,
                        storeImage: n.product.storeId.storeImage,
                        storeName: n.product.storeId.companyName
                    })
                }

                const countryArray = await loadash.groupBy(arr, "storeId");
                let finalProductArray = []
                await Object.entries(countryArray).forEach(async ([key, value]) => {
                    // let tempDummyArray=[];
                    // value.map((item,index)=>{
                    //     if(index!==0){
                    //         delete item.storeId;
                    //         delete item.storeImage;
                    //         delete item.storeName;
                    
                    //     } 
                    //     tempDummyArray.push(item)
                        
                    // })
                    finalProductArray.push(value)
                });
                res.status(200).json({
                    data: finalProductArray
                })
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Remove from cart
exports.postRemoveProductFromCart = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    const productId = req.body.inputProductId;
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: id })
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
exports.postClearCart = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: id })
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
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    const d = req.body;

    user.findOne({ _id: id })
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
exports.postRemoveAddress = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    const addressId = req.body.inputAddressId;
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!addressId) return res.status(201).json({ status: false, message: "Enter Address Id" });

    user.findOne({ _id: id })
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
exports.postGetAddress = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: id })
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
exports.postAddWishlist = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    const productId = req.body.inputProductId;
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: id })
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
exports.postRemoveProductWishList = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    const productId = req.body.inputProductId;
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: id })
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
exports.postClearWishList = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: id })
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
exports.postGetWishList = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });

    user.findOne({ _id: id })
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
exports.postRecentItems = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    const productId = req.body.inputProductId;
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: id })
        .then(result => {
            if (result) {
                products.findById(productId)
                    .then(async prod => {
                        if (prod) {
                            let arr = result.recentItems.items;
                            var im = prod.images.split(',');
                            var fim = im[0];
                            let status = false;
                            let arrr = [];
                            let empty = await isEmptyObject(arr);
                            //console.log(empty);
                            if (empty) {
                                arr.push({
                                    product: productId,
                                    name: prod.name,
                                    image: fim,
                                    price: prod.price
                                })
                                result.recentItems.items = arr;
                            } else {
                                for (let x of arr) {
                                    if (x.product.toString() != prod._id.toString()) {
                                        status = true;
                                        arrr.push(x);
                                    }
                                }
                                arrr.push({
                                    product: productId,
                                    name: prod.name,
                                    image: fim,
                                    price: prod.price
                                })
                                result.recentItems.items = arrr;
                            }
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
exports.postGetRecentList = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    user.findOne({ _id: id })
        // .populate({
        //     path:'recentItems',
        //     populate: {
        //         path: 'items',
        //         populate:{
        //             path:'product'
        //         }
        //     }
        // })
        .then(users => {
            if (users) {
                data = users.recentItems.items;
                data.reverse();
                res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
}

//Add Order

