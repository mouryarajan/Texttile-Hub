const products = require('../models/m-products');

exports.postProducts = (req, res, next) => {
    d = req.body;
    if(!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });

    try {
        Products = new product({
            name: d.inputName,
            brandName: d.inputBrandName,
            category: d.inputCategory,
            price: d.inputPrice,
            color: d.inputColor,
            type: d.inputType,
            quantity: d.inputQuantity,
            fabric: d.inputFabric,
            description: d.inputDescription,
            catologue: d.inputCatologue,
            storeId: d.inputStoreId
        });
        Products.save()
            .then(data => {
                if (data) {
                    res.status(200).json({ status: true, message: "Product added." });
                } else {
                    res.status(201).json({ status: false, message: "Something went wrong." });
                }
            }).catch(err=>{console.log(err)});
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.getProducts = (req, res, next) => {
    const storeId = req.body.inputStoreId;
    if(!storeId) return res.status(201).json({ status: false, message: "Enter store id" });

    products.find({storeId: storeId})
    .then(data=>{
        if(data){
            res.status(200).json({ status: true, data: data });
        }else{
            res.status(201).json({ status: false, message: "Something went wrong." });
        }
    }).catch(err=>{console.log(err)});
}

exports.getSize = (req, res, next) => {
    arr = {
        S: "S", M: "M", L: "L", Xl: "XL", XXl: "XXL", XXXl: "XXXL"
    }
    res.status(200).json({
        data: arr
    })
}