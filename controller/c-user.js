const user = require('../models/m-user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postLoginCheck = async (req, res, next) => {
    const phno = req.body.inputPhoneNumber;
    const password = req.body.inputPassword;

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
    res.status(401).header('auth-token', token).json({
        status: true,
        data: arr
    })
};

exports.postRegister = async (req, res, next) => {
    const phno = Number(req.body.inputPhoneNumber);

    const data = await user.findOne({phoneNumber:phno});
    if(data) return res.json({ status: false, message: "User Already Exist With This Phone Number!" });

    const otp = Number(Math.floor(100000 + Math.random() * 900000));
    const User = new user({
        phoneNumber: phno,
        otp: otp
    });
    User.save()
        .then(result => {
            if (result) {
                res.json({
                    status: true,
                    otp: otp
                })
            } else {
                res.json({
                    status: false
                })
            }
        }).catch(err => { console.log(err) });
}

exports.postPassword = async (req, res, next) => {
    const phno = Number(req.body.inputPhoneNumber);
    const password = req.body.inputPassword;

    //Hash Password
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
}