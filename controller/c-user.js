const user = require('../models/m-user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const products = require('../models/m-products');


//Login 
exports.postLoginCheck = async (req, res, next) => {
    const phno = req.body.inputPhoneNumber;
    const password = req.body.inputPassword;
    if (!phno) return res.json({ status: false, message: "Enter Phone Number" });
    if (!password) return res.json({ status: false, message: "Enter Password" });
    try {
        const data = await user.findOne({ phoneNumber: phno }).select('name').select('phoneNumber').select('password');
        if (!data) return res.json({ status: false, message: "Phone Number or Password is Invalid!" });

        const validPassword = await bcrypt.compare(password, data.password);
        if (!validPassword) return res.json({ status: false, message: "invalid password!" });

        arr = {
            firstName: data.name.firstName,
            lastName: data.name.lastName,
            phoneNumber: data.phoneNumber,
            image: data.image
        }
        const token = jwt.sign({
            userId: data._id
        }, process.env.TOKEN_SECRET);
        res.status(200).header('auth-token', token).json({
            status: true,
            data: arr
        })
    } catch (err) {
        res.status(201).json({ err });
    }
};

//Registration
exports.postRegister = async (req, res, next) => {
    const phno = Number(req.body.inputPhoneNumber);
    if (!phno) return res.status(201).json({ status: false, message: "Enter Phone Number" });

    try {
        const data = await user.findOne({ phoneNumber: phno });
        if (data) return res.json({ status: false, message: "User Already Exist With This Phone Number!" });

        const otp = Number(Math.floor(100000 + Math.random() * 900000));
        const User = new user({
            phoneNumber: phno,
            otp: otp
        });
        User.save()
            .then(result => {
                if (result) {
                    res.status(200).json({
                        status: true,
                        otp: otp
                    })
                } else {
                    res.status(201).json({
                        status: false
                    })
                }
            }).catch(err => { console.log(err) });
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

        user.findOne({ phoneNumber: phno }).select('phoneNumber').select('password')
            .then(result => {
                if (result) {
                    result.password = hashPassword;
                    result.save()
                        .then(data => {
                            if (data) {
                                res.json({
                                    status: true
                                })
                            } else {
                                res.json({
                                    status: false
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                }
            }).catch(err => {
                console.log(err);
            })
    } catch (err) {
        res.status(201).json({ err });
    }
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
                            return user.addToCart(prod);
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
            }else{
                res.status(201).json({ status: false, message: "User not found" });
            }
        }).catch(err => { console.log(err) });
};

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
        }).catch(err=>{console.log(err)});
};

//Clear Cart