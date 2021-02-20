const user = require('../models/m-user');
const products = require('../models/m-products');
const order = require('../models/m-order');
const store = require('../models/m-store');
const fetch = require('node-fetch');
let base64 = require('base-64');
const { isDefined, isEmptyObject, decodeDataFromAccessToken, isValueExistInArray } = require('../handler/common');
const { findOne } = require('../models/m-user');

exports.postOrder = async (req, res, next) => {
    const d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Missing data" });
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    const sid = d.inputStoreId;
    user.findOne({ _id: id })
        .then(async data => {
            let arr = data.cart.items;
            let add = data.address.items;
            var today = new Date();
            var ddd = today.getDate();
            var mmm = today.getMonth() + 1;
            var yy = today.getFullYear();
            var tday = ddd + '/' + mmm + '/' + yy;
            var someDate = new Date();
            var numberOfDaysToAdd = 6;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            var dd = someDate.getDate();
            var mm = someDate.getMonth() + 1;
            var y = someDate.getFullYear();
            var a;
            let sta = false;
            for (let n of add) {
                if (n._id == req.body.inputAddressId) {
                    a = n;
                    sta = true;
                    break;
                }
            }
            if (!sta) {
                res.status(201).json({ status: false, message: "Address not found!" });
            }
            var someFormattedDate = dd + '/' + mm + '/' + y;
            let orderIdArray = [];
            let totalAmount = 0;
            for (let n of arr) {
                let pro = await products.findOne({ _id: n.product });
                if (pro.storeId.toString() == sid.toString()) {
                    let s = " ";
                    if (n.size) {
                        s = n.size;
                    }
                    let x = n.image.split(',');
                    if (pro.quantity >= n.quantity) {
                        pro.quantity = pro.quantity - n.quantity;
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                    if (n.size) {
                        if (n.size.toLowerCase() == 's') {
                            if (pro.s >= Number(n.quantity)) {
                                pro.s = pro.s - n.quantity;
                            } else {
                                res.status(201).json({
                                    message: "Out of Stock",
                                    status: false
                                })
                            }
                        }
                        if (n.size.toLowerCase() == 'm') {
                            if (pro.m >= Number(n.quantity)) {
                                pro.m = pro.m - n.quantity;
                            } else {
                                res.status(201).json({
                                    message: "Out of Stock",
                                    status: false
                                })
                            }
                        }
                        if (n.size.toLowerCase() == 'l') {
                            if (pro.l >= Number(n.quantity)) {
                                pro.l = pro.l - n.quantity;
                            } else {
                                res.status(201).json({
                                    message: "Out of Stock",
                                    status: false
                                })
                            }
                        }
                        if (n.size.toLowerCase() == 'xl') {
                            if (pro.xl >= Number(n.quantity)) {
                                pro.xl = pro.xl - n.quantity;
                            } else {
                                res.status(201).json({
                                    message: "Out of Stock",
                                    status: false
                                })
                            }
                        }
                        if (n.size.toLowerCase() == 'xxl') {
                            if (pro.xxl >= Number(n.quantity)) {
                                pro.xxl = pro.xxl - n.quantity;
                            } else {
                                res.status(201).json({
                                    message: "Out of Stock",
                                    status: false
                                })
                            }
                        }
                        if (n.size.toLowerCase() == 'xxxl') {
                            if (pro.xxxl >= Number(n.quantity)) {
                                pro.xxxl = pro.xxxl - n.quantity;
                            } else {
                                res.status(201).json({
                                    message: "Out of Stock",
                                    status: false
                                })
                            }
                        }
                    }
                    if (d.inputPaymentMode == "COD") {
                        await pro.save();
                    }
                    totalAmount = totalAmount + Number(n.price);
                    let Order = new order({
                        userId: id,
                        product: pro._id,
                        productName: n.name,
                        store: n.storeId,
                        image: x[0],
                        payment: d.inputPaymentMode,
                        quantity: n.quantity,
                        size: s,
                        color: n.color,
                        placeDate: tday,
                        deliverDate: someFormattedDate,
                        amount: n.price,
                        type: a.type,
                        street: a.street,
                        landmark: a.landmark,
                        city: a.city,
                        state: a.state,
                        pincode: a.pincode,
                        phoneNumber: data.phoneNumber,
                        store: pro.storeId
                    });
                    Order.save()
                        .then(data => {
                            orderIdArray.push(data._id);
                        }).catch(err => { console.log(err) });
                }
            }

            if (d.inputPaymentMode == "COD") {
                for (let x of arr) {
                    if (x.storeId == sid) {
                        data.removeFromCart(x.product);
                    }
                }
            }

            //Razor Pay
            //const amount = totalAmount*100;
            const amount = 100;
            const currency = "INR";
            const receipt = "order_rcptid_11";
            const body = { amount: amount, currency: currency, receipt: receipt };

            let url = 'https://api.razorpay.com/v1/orders';
            let username = 'rzp_live_t67U0BoWeFiPpO';
            let password = '7lIb1BrxQvhZ6rJEFoZfEYMQ';

            let headers = new fetch.Headers();
            headers.append('Content-Type', 'text/json');
            headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers,
            }).then(response => response.json())
                .then(json => {
                    res.status(200).json({
                        razorPayId: json.id,
                        orderId: orderIdArray
                    });
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}

exports.postOrderStatus = async (req, res, next) => {
    const orderId = req.body.inputOrderId;
    const status = req.body.inputPaymentStatus;
    const storeId = req.body.inputStoreId;
    if (!storeId) return res.status(201).json({ status: false, message: "Enter Store Id" });
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Enter User Id" });
    try {
        if (status == true || status == 'true') {
            for (let n of orderId) {
                order.findOne({ _id: n })
                    .then(async result => {
                        if (result) {
                            result.paymentStatus = true;
                            await result.save();
                            user.findOne({ _id: id })
                                .then(async data => {
                                    if (data) {
                                        let arr = data.cart.items;
                                        for (let n of arr) {
                                            let pro = await products.findOne({ _id: n.product });
                                            if (n.size) {
                                                if (n.size.toLowerCase() == 's') {
                                                    if (pro.s >= Number(n.quantity)) {
                                                        pro.s = pro.s - n.quantity;
                                                    }
                                                }
                                                if (n.size.toLowerCase() == 'm') {
                                                    if (pro.m >= Number(n.quantity)) {
                                                        pro.m = pro.m - n.quantity;
                                                    }
                                                }
                                                if (n.size.toLowerCase() == 'l') {
                                                    if (pro.l >= Number(n.quantity)) {
                                                        pro.l = pro.l - n.quantity;
                                                    }
                                                }
                                                if (n.size.toLowerCase() == 'xl') {
                                                    if (pro.xl >= Number(n.quantity)) {
                                                        pro.xl = pro.xl - n.quantity;
                                                    }
                                                }
                                                if (n.size.toLowerCase() == 'xxl') {
                                                    if (pro.xxl >= Number(n.quantity)) {
                                                        pro.xxl = pro.xxl - n.quantity;
                                                    }
                                                }
                                                if (n.size.toLowerCase() == 'xxxl') {
                                                    if (pro.xxxl >= Number(n.quantity)) {
                                                        pro.xxxl = pro.xxxl - n.quantity;
                                                    }
                                                }
                                            }
                                            await pro.save();
                                            if (n.storeId == storeId) {
                                                data.removeFromCart(n.product);
                                            }
                                        }
                                    } else {
                                        res.status(201).json({
                                            message: "Something Went Wrong!"
                                        })
                                    }
                                });
                        } else {
                            res.status(201).json({
                                message: "Something Went Wrong!"
                            })
                        }
                    })
            }
        } else {
            for (let n of orderId) {
                await order.findByIdAndDelete(n);
            }
        }
        res.status(200).json({
            status: true
        })
    } catch {
        res.status(201).json({
            message: "Something Went Wrong!"
        })
    }
}

exports.postBuyNow = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Unauthorised user" });
    let pid = req.body.inputProductId;
    if (!pid) return res.status(201).json({ status: false, message: "Provide product id!" });
    user.findOne({ _id: id })
        .then(async data => {
            let add = data.address.items;
            //console.log(add);
            var today = new Date();
            var ddd = today.getDate();
            var mmm = today.getMonth() + 1;
            var yy = today.getFullYear();
            var tday = ddd + '/' + mmm + '/' + yy;
            var someDate = new Date();
            var numberOfDaysToAdd = 6;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            var dd = someDate.getDate();
            var mm = someDate.getMonth() + 1;
            var y = someDate.getFullYear();
            var a = [];
            let sta = false;
            for (let n of add) {
                if (n._id == req.body.inputAddressId) {
                    a = n;
                    sta = true;
                    break;
                }
            }
            if (!sta) {
                res.status(201).json({ status: false, message: "Address not found!" });
            }
            var someFormattedDate = dd + '/' + mm + '/' + y;
            let pro = await products.findOne({ _id: req.body.inputProductId });
            if (pro.quantity >= req.body.inputQuantity) {
                pro.quantity = pro.quantity - req.body.inputQuantity;
            } else {
                res.status(201).json({
                    message: "Out of Stock",
                    status: false
                })
            }
            if (req.body.inputSize) {
                if (req.body.inputSize == 's') {
                    if (pro.s >= Number(req.body.inputQuantity)) {
                        pro.s = pro.s - Number(req.body.inputQuantity);
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                }
                if (req.body.inputSize == 'm') {
                    if (pro.m >= Number(req.body.inputQuantity)) {
                        pro.m = pro.m - Number(req.body.inputQuantity);
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                }
                if (req.body.inputSize == 'l') {
                    if (pro.l >= Number(req.body.inputQuantity)) {
                        pro.l = pro.l - Number(req.body.inputQuantity);
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                }
                if (req.body.inputSize == 'xl') {
                    if (pro.xl >= Number(req.body.inputQuantity)) {
                        pro.xl = pro.xl - Number(req.body.inputQuantity);
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                }
                if (req.body.inputSize == 'xxl') {
                    if (pro.xxl >= Number(req.body.inputQuantity)) {
                        pro.xxl = pro.xxl - Number(req.body.inputQuantity);
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                }
                if (req.body.inputSize == 'xxxl') {
                    if (pro.xxxl >= Number(req.body.inputQuantity)) {
                        pro.xxxl = pro.xxxl - Number(req.body.inputQuantity);
                    } else {
                        res.status(201).json({
                            message: "Out of Stock",
                            status: false
                        })
                    }
                }
            }
            await pro.save();
            let fprice = 0;
            fprice = pro.price * req.body.inputQuantity;
            let Order = new order({
                userId: id,
                product: pro._id,
                productName: pro.name,
                store: pro.storeId,
                image: req.body.inputImage,
                payment: req.body.inputPaymentMode,
                quantity: req.body.inputQuantity,
                size: req.body.inputSize,
                color: req.body.inputColor,
                placeDate: tday,
                deliverDate: someFormattedDate,
                amount: fprice,
                type: a.type,
                street: a.street,
                landmark: a.landmark,
                city: a.city,
                state: a.state,
                pincode: a.pincode,
                phoneNumber: data.phoneNumber,
                store: pro.storeId
            });
            Order.save()
                .then(result => {
                    const amount = 100;
                    const currency = "INR";
                    const receipt = "order_rcptid_11";
                    const body = { amount: amount, currency: currency, receipt: receipt };

                    let url = 'https://api.razorpay.com/v1/orders';
                    let username = 'rzp_live_t67U0BoWeFiPpO';
                    let password = '7lIb1BrxQvhZ6rJEFoZfEYMQ';

                    let headers = new fetch.Headers();
                    headers.append('Content-Type', 'text/json');
                    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: headers,
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (typeof json.id !== 'undefined' && json.id !== null && json.id !== "") {
                                res.status(200).json({
                                    status: true,
                                    data: {
                                        orderId: result._id,
                                        razorPayId: json.id
                                    }
                                });
                            } else {
                                res.status(201).json({
                                    status: false,
                                    message: "Something went wrong"
                                });
                            }
                        });
                }).catch(err => console.log(err));
        }).catch(err => console.log(err));
}

exports.postUpdateOrderPayment = async (req, res, next) => {
    const orderId = req.body.inputOrderId;
    const paymentStatus = req.body.inputPaymentStatus;
    if (paymentStatus == true || paymentStatus == 'true') {
        order.findOne({ _id: orderId })
            .then(result => {
                if (result) {
                    result.paymentStatus = true;
                    result.save()
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
                        }).catch(err => console.log(err));
                } else {
                    res.status(201).json({
                        status: false,
                        message: "Order not found with respected order id"
                    });
                }
            }).catch(err => console.log(err));
    } else {
        order.findByIdAndDelete(orderId)
            .then(result => {
                if (result) {
                    res.status(200).json({
                        status: true,
                        message: "Order removed!"
                    });
                } else {
                    res.status(201).json({
                        status: false,
                        message: "Something went wrong"
                    });
                }
            }).catch(err => console.log(err));
    }
}

exports.orderAddressUpdate = (req, res, next) => {
    const oid = req.body.inputOrderid;
    const d = req.body;
    if (!oid) return res.status(201).json({ message: "Provide proper details" });
    order.findOne({ _id: oid })
        .then(data => {
            var uid = data.userId;
            user.findOne({ _id: uid })
                .then(async result => {
                    let add = result.address.items;
                    let a;
                    for (let n of add) {
                        if (n._id == d.addressid) {
                            a = n;
                        }
                    }
                    data.type = a.type;
                    data.street = a.street;
                    data.landmark = a.landmark;
                    data.city = a.city;
                    data.state = a.state;
                    data.pincode = a.pincode;
                    data.save()
                        .then(ans => {
                            res.status(200).json({
                                status: true
                            })
                        }).catch(err => { console.log(err) });
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}

exports.orderCancel = (req, res, next) => {
    const oid = req.body.inputOrderid;
    if (!oid) return res.status(201).json({ message: "Provide proper detailss" });
    order.findOne({ _id: oid })
        .then(data => {
            var today = new Date();
            var ddd = today.getDate();
            var mmm = today.getMonth() + 1;
            var yy = today.getFullYear();
            var tday = ddd + '/' + mmm + '/' + yy;
            if (tday == data.deliverDate) {
                return res.status(201).json({ message: "You can't cancel the order on the delivery date" });
            }
            data.is_cancel = false;
            data.save()
                .then(result => {
                    res.status(200).json({ status: true });
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}

exports.postUpdateOrderStatus = (req, res, next) => {
    const oid = req.body.inputOrderid;
    const status = req.body.inputStatus;
    if (!oid) return res.status(201).json({ message: "Provide proper details" });
    order.findOne({ _id: oid })
        .then(data => {
            data.status = status;
            data.save()
                .then(result => {
                    res.status(200).json({ status: true });
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}

exports.getOrder = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Unauthorised user" });
    const stro = await store.findOne({ userId: id });
    if (!stro) return res.status(201).json({ status: false, message: "Store not found" });
    if (stro.isApproved == true) {
        order.find({ store: stro._id }).populate({ path: 'userId', select: 'name phoneNumber gender email' })
            .populate({
                path: 'product', select: 'brandName category type fabric',
                populate: [
                    {
                        path: 'brandName',
                        select: 'brandName',
                        model: 'tblbrand'
                    },
                    {
                        path: 'category',
                        select: 'name image',
                        model: 'tblcategory'
                    },
                    {
                        path: 'type',
                        select: 'typeName',
                        model: 'tbltype'
                    },
                    {
                        path: 'fabric',
                        select: 'fabricName',
                        model: 'tblfabric'
                    }
                ]
            })
            .then(data => {
                res.status(200).json({
                    data: data
                })
            }).catch(err => { console.log(err) });
    } else {
        res.status(201).json({ status: false, message: "You are not authorised user" });
    }

}

exports.getUserOrder = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Unauthorised user" });
    const data = await order.find({ userId: id })
        .populate({
            path: 'product',
            select: 'brandName description',
            populate: {
                path: 'brandName',
                select: 'brandName',
                model: 'tblbrand'
            }
        });
    res.status(200).json({
        data: data
    })
}