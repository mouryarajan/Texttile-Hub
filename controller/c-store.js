const store = require('../models/m-store');
const user = require('../models/m-user');
const product = require('../models/m-products');
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');

exports.postStore = async (req, res, next) => {
    try {
        const d = req.body;
        if (!d) return res.status(201).json({ status: false, message: "Provide Proper Data" });
        let id;
        await decodeDataFromAccessToken(req.headers.token).then((data) => {
            id = data.userId;
        })
        if (!id) return res.status(201).json({ status: false, message: "Auth token failed" });
        const pay = d.inputPaymentMode;
        const payArray = pay.split(',');
        const payment = [];
        for (let x of payArray) {
            payment.push({
                mode: x
            })
        }
        const finalPayment = {
            items: payment
        };
        let upi = "";
        if(d.inputUpiId){
            upi = d.inputUpiId
        }
        const Store = new store({
            companyName: d.inputCompanyName,
            companyEmail: d.inputCompanyEmail,
            brandName: d.inputBrandName,
            gstNumber: d.inputGstNumber,
            panNumber: d.inputPanNumber,
            panName: d.inputPanName,
            contactName: d.inputContactName,
            contactNumber: d.inputContactNumber,
            bankDetail: {
                accountNumber: d.inputAccountNumber,
                accountName: d.inputAccountName,
                ifscCode: d.inputIfscCode,
                bankName: d.inputBankName,
            },
            storeType: d.inputStoreType,
            alternatePhoneNumber: d.inputAlternatePhoneNumber,
            address: {
                street: d.inputStreet,
                landmark: d.inputLandmark,
                city: d.inputCity,
                state: d.inputState,
                pincode: d.inputPincode,
            },
            document: {
                panCard: d.inputPanCard,
                gstCard: d.inputGstCard,
                cancelCheck: d.inputCancelCheck,
            },
            userId: id,
            storeImage: d.inputStoreImage,
            remark: null,
            paymentMode: finalPayment,
            upi: upi
        });
        const use = await user.findOne({ _id: id });
        const data = await Store.save();
        if (!data) return res.status(201).json({ status: false, message: "Something Went Wrong" });
        use.storeRequest = true;
        await use.save();
        res.status(200).json({
            status: true,
            message: "Wait for Approval!"
        });
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.editStore = async (req, res, next) => {
    const d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Provide Proper Data" });
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Auth token failed" });
    const data = await store.findOne({ userId: id });
    const pay = d.inputPaymentMode;
    const payArray = pay.split(',');
    const payment = [];
    for (let x of payArray) {
        payment.push({
            mode: x
        })
    }
    const finalPayment = {
        items: payment
    };
    if (data) {
        data.companyName = d.inputCompanyName;
        data.companyEmail = d.inputCompanyEmail;
        data.brandName = d.inputBrandName;
        data.gstNumber = d.inputGstNumber;
        data.panNumber = d.inputPanNumber;
        data.panName = d.inputPanName;
        data.contactName = d.inputContactName;
        data.contactNumber = d.inputContactNumber;
        data.bankDetail = {
            accountNumber: d.inputAccountNumber,
            accountName: d.inputAccountName,
            ifscCode: d.inputIfscCode,
            bankName: d.inputBankName,
        };
        data.storeType = d.inputStoreType;
        data.alternatePhoneNumber = d.inputAlternatePhoneNumber;
        data.address = {
            street: d.inputStreet,
            landmark: d.inputLandmark,
            city: d.inputCity,
            state: d.inputState,
            pincode: d.inputPincode,
        };
        data.document = {
            panCard: d.inputPanCard,
            gstCard: d.inputGstCard,
            cancelCheck: d.inputCancelCheck,
        };
        data.userId = id;
        data.storeImage = d.inputStoreImage;
        data.remark = null;
        data.paymentMode = finalPayment;
        data.save()
            .then(result => {
                if(result){
                    res.status(200).json({
                        status: true
                    })
                }else{
                    res.status(201).json({
                        status: false,
                        message: "Something went wrong!"
                    })
                }
                
            }).catch(err => console.log(err));
    } else {
        res.status(201).json({
            status: false,
            message: "Store not found"
        })
    }
}

exports.editMinorStore = async (req, res, nest) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Auth token failed" });
    store.findOne({ userId: id })
        .then(data => {
            if (data) {
                let finalPayment = data.paymentMode;
                if (req.body.inputPaymentMode) {
                    const pay = req.body.inputPaymentMode;
                    const payArray = pay.split(',');
                    const payment = [];
                    for (let x of payArray) {
                        payment.push({
                            mode: x
                        })
                    }
                    finalPayment = {
                        items: payment
                    };
                }
                data.paymentMode = finalPayment;
                if (req.body.inputStoreImage) {
                    data.storeImage = req.body.inputStoreImage;
                }
                if (req.body.inputContactName) {
                    data.contactName = req.body.inputContactName;
                }
                if (req.body.inputContactNumber) {
                    data.contactNumber = req.body.inputContactNumber;
                }
                if (req.body.inputStoreType) {
                    data.storeType = req.body.inputStoreType;
                }
                if(req.body.inputCompanyEmail){
                    data.companyEmail = req.body.inputCompanyEmail;
                }
                if(req.body.inputStreet){
                    data.address.street = req.body.inputStreet;
                }
                if(req.body.inputLandmark){
                    data.address.landmark = req.body.inputLandmark;
                }
                if(req.body.inputCity){
                    data.address.city = req.body.inputCity;
                }
                if(req.body.inputState){
                    data.address.state = req.body.inputState;
                }
                if(req.body.inputPincode){
                    data.address.pincode = req.body.inputPincode;
                }
                if(req.body.inputAlternatePhoneNumber){
                    data.alternatePhoneNumber = req.body.inputAlternatePhoneNumber;
                }
                if(req.body.inputUpiId){
                    data.upi = req.body.inputAlternatePhoneNumber;
                }
                data.save()
                    .then(result => {
                        res.status(200).json({ status: true })
                    }).catch(err => console.log(err));
            } else {
                res.status(201).json({ message: "Store not found", status: false })
            }
        }).catch(err => console.log(err));
}

exports.getPaymentMode = async (req, res, next) => {
    pid = req.body.inputProductId;
    if (!pid) return res.status(201).json({ status: false, message: "Provide product id" });
    const prod = await product.findOne({_id:pid}).select('storeId');
    const stro = await store.findOne({_id:prod.storeId}).select('paymentMode');
    let data = stro.paymentMode.items;
    let arr = [];
    for(let x of data){
        arr.push(x.mode);
    }
    res.status(200).json({
        data: arr
    })
}

exports.getStore = async (req, res, next) => {
    try {
        const data = await store.find();
        //.select('storeImage').select('companyName');
        if(data){
            res.status(200).json({
                status: true,
                data: data
            });
        }else{
            res.status(201).json({
                status: false,
                message: "Opp's no store available!"
            });
        }
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.getStoreHome = async (req, res, next) => {
    try {
        const data = await store.find({ isApproved: true }).select('companyName').select('storeImage');
        res.status(200).json({
            status: true,
            data: data
        });
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.approveStore = async (req, res, next) => {
    const storeId = req.body.inputStoreId;
    const status = req.body.inputStatus;
    if (!storeId) return res.json({ status: false, message: "Enter Store Id" });

    try {
        const data = await store.findOne({ _id: storeId });
        if (!data) return res.status(201).json({ status: false, message: "Something Went Wrong" });
        data.isApproved = status;
        if (!data.status) {
            data.remark = req.body.inputRemark;
        }

        if (status == true || status == 'true') {
            user.findOne({ _id: data.userId }).then(response => { response.role = "Merchant"; response.storeRequest = true; response.save(); }).catch(err => { console.log(err) });
        } else {
            user.findOne({ _id: data.userId }).then(response => { response.role = "Customer"; response.storeRequest = false; response.save(); }).catch(err => { console.log(err) });
        }

        const result = await data.save();
        if (!result) return res.status(201).json({ status: false, message: "Something Went Wrong" });

        res.status(200).json({
            status: true
        });
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.getOwnStore = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    })
    if (!id) return res.status(201).json({ status: false, message: "Auth token failed" });
    store.findOne({ userId: id })
        .then(data => {
            res.status(200).json({
                data: data
            })
        }).catch(err => console.log(err));
}
