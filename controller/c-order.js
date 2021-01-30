const user = require('../models/m-user');
const products = require('../models/m-products');
const order = require('../models/m-order');
const store = require('../models/m-store');
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
            for (let n of add) {
                if (n._id == d.addressid) {
                    a = n;
                } else {
                    res.status(201).json({ status: false, message: "Address not found!" });
                }
            }
            var someFormattedDate = dd + '/' + mm + '/' + y;
            for (let n of arr) {
                let s = " ";
                if (n.size) {
                    s = n.size;
                }
                let x = n.image.split(',');
                const pro = await products.findOne({ _id: n.product });

                let Order = new order({
                    userId: id,
                    product: n._id,
                    productName: n.name,
                    store: n.storeId,
                    image: d.inputImage,
                    payment: d.paymentMode,
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
                await Order.save();
            }
            return data.clearCart();
        })
        .then(result => {
            res.status(200).json({ message: "order placed successfully" });
        }).catch(err => { console.log(err) });
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
            // for (let n of add) {
            //     if (n._id == req.body.inputAddressId) {
            //         a = n;
            //     } else {
            //         res.status(201).json({ status: false, message: "Address not found!" });
            //     }
            // }
            a = await isValueExistInArray(add, req.body.inputAddressId);
            if (a.length === 0) {
                return res.status(201).json({ status: false, message: "Address not found!" });
            }
            //console.log(a);
            var someFormattedDate = dd + '/' + mm + '/' + y;
            const pro = await products.findOne({ _id: req.body.inputProductId });
            let fprice = 0;
            if (req.body.inputQuantity > 1) {
                fprice = pro.price * req.body.inputQuantity
            }
            let x = pro.images.split(',');
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
                    res.status(200).json({
                        status: true
                    });
                }).catch(err => console.log(err));
        }).catch(err => console.log(err));
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
    if (!status) return res.status(201).json({ message: "Provide proper details" });
    order.findOne({ _id: oid }).sort({ deliverDate: 'desc' })
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
    const stro = await findOne({userId:id});
    if (!stro) return res.status(201).json({ status: false, message: "Store not found" });
    order.find({ store: stro_id })
        .then(data => {
            res.status(200).json({
                data: data
            })
        }).catch(err => { console.log(err) });
}

exports.getUserOrder = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Unauthorised user" });
    const data = await order.find({ userId: id });
    res.status(200).json({
        data: data
    })
}