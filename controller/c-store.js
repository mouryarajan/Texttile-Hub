const store = require('../models/m-store');
const user = require('../models/m-user');
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
            remark: null
        });
        const data = await Store.save();
        if (!data) return res.status(201).json({ status: false, message: "Something Went Wrong" });

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
    const data = await store.findOne({userId:id});
    if(data){
        data.companyName = d.inputCompanyName;
        data.companyEmail = d.inputCompanyEmail;
        data.brandName = d.inputBrandName;
        data.gstNumber = d.inputGstNumber;
        data.panNumber = d.inputPanNumber;
        data.panName= d.inputPanName;
        data.contactName= d.inputContactName;
        data.contactNumber= d.inputContactNumber;
        data.bankDetail = {
            accountNumber: d.inputAccountNumber,
            accountName: d.inputAccountName,
            ifscCode: d.inputIfscCode,
            bankName: d.inputBankName,
        };
        data.storeType= d.inputStoreType;
        data.alternatePhoneNumber= d.inputAlternatePhoneNumber;
        data.address= {
            street: d.inputStreet,
            landmark: d.inputLandmark,
            city: d.inputCity,
            state: d.inputState,
            pincode: d.inputPincode,
        };
        data.document= {
            panCard: d.inputPanCard,
            gstCard: d.inputGstCard,
            cancelCheck: d.inputCancelCheck,
        };
        data.userId= id;
        data.storeImage= d.inputStoreImage;
        data.remark = null;
        data.save()
        .then(result=>{
            res.status(200).json({
                status: true
            })
        }).catch(err=>console.log(err));
    }else{
        res.status(201).json({
            status: false,
            message: "Store not found"
        })
    }
}

exports.getStore = async (req, res, next) => {
    try {
        const data = await store.find();
        //.select('storeImage').select('companyName');
        res.status(200).json({
            status: true,
            data: data
        });
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

        if (status) {
            user.findOne({ _id: data.userId }).then(response => { response.role = "Merchant"; response.save(); }).catch(err => { console.log(err) });
        } else {
            user.findOne({ _id: data.userId }).then(response => { response.role = "Customer"; response.save(); }).catch(err => { console.log(err) });
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
