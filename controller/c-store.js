const store = require('../models/m-store');

exports.postStore = async (req, res, next)=>{
    const Store = new store({
        companyName: req.body.inputCompanyName,
        companyEmail: req.body.inputCompanyEmail,
        brandName: req.body.inputBrandName,
        gstNumber: req.body.inputGstNumber,
        panNumber: req.body.inputPanNumber,
        contactName: req.body.inputContactName,
        contactNumber: req.body.inputContactNumber,
        bankDetail:{
            accountNumber: req.body.inputAccountNumber,
            accountName: req.body.inputAccountName,
            ifscCode: req.body.inputIfscCode,
            bankName: req.body.inputBankName,
        },
        storeType: req.body.inputStoreType,
        alternatePhoneNumber: req.body.inputAlternatePhoneNumber,
        address:{
            street: req.body.inputStreet,
            landmark: req.body.inputLandmark,
            city: req.body.inputCity,
            state: req.body.inputState,
            pincode: req.body.inputPincode,
        },
        document: {
            panCard: req.body.inputPanCard,
            gstCard: req.body.inputGstCard,
            cancelCheck: req.body.inputCancelCheck,
        },
        userId: req.body.inputUserId
    });
    const data = await Store.save();
    if(!data) return res.status(400).json({status:false,message: "Something Went Wrong"});

    res.status(401).json({
        status: true,
        message: "Wait for Approval!"
    });
}

exports.getStore = async (req, res, next)=>{
    const data = await store.find();
    if(!data) return res.status(400).json({status:false,message: "Something Went Wrong"});

    res.status(401).json({
        status: true,
        data: data
    });
}

exports.approveStore = async (req, res, next)=>{
    
}

