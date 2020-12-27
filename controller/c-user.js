const user = require('../models/m-user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const products = require('../models/m-products');
const { isDefined, isEmptyObject } = require('../handler/common');

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
            authToken: token
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
    } catch (err) {
        res.status(201).json({ err });
    }
}

//Edit User
exports.postEditUser = (req, res, next) => {
    const d = req.body;
    const phno = Number(d.inputPhoneNumber);
    const gender = d.inputGender;
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
    if (!userId) return res.status(201).json({ status: false, message: "Enter User Id" });
    if (!productId) return res.status(201).json({ status: false, message: "Enter Product Id" });

    user.findOne({ _id: userId })
        .then(users => {
            if (users) {
                products.findById(productId)
                    .then(prod => {
                        if (prod) {
                            let arr = result.cart.items;
                            arr.push({

                            });
                        } else {
                            res.status(201).json({ status: false, message: "Product not found" });
                        }
                    })
                    .then(result => {
                        if (result) {
                            res.status(200).json({ status: true })
                        } else {
                            res.status(201).json({ status: false, message: "Add to cart failed" });
                        }
                    }).catch(err => { console.log(err) });
            } else {
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
};

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