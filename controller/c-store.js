const store = require('../models/m-store');

exports.postStore = async (req, res, next) => {
    try {
        const d = req.body;
        const Store = new store({
            companyName: d.inputCompanyName,
            companyEmail: d.inputCompanyEmail,
            brandName: d.inputBrandName,
            gstNumber: d.inputGstNumber,
            panNumber: d.inputPanNumber,
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
            userId: d.inputUserId
        });
        const data = await Store.save();
        if (!data) return res.status(201).json({ status: false, message: "Something Went Wrong" });

        res.status(401).json({
            status: true,
            message: "Wait for Approval!"
        });
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.getStore = async (req, res, next) => {
    try {
        const data = await store.find();
        if (!data) return res.status(201).json({ status: false, message: "Something Went Wrong" });

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
    if (!status) return res.json({ status: false, message: "Status is null" });

    try {
        const data = await store.findOne({ _id: storeId });
        if (!data) return res.status(201).json({ status: false, message: "Something Went Wrong" });
        data.isApproved = status;

        const result = await data.save();
        if (!result) return res.status(201).json({ status: false, message: "Something Went Wrong" });

        res.status(200).json({
            status: true
        });
    } catch (err) {
        res.status(201).json({ err });
    }
}

