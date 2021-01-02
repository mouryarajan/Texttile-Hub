const products = require('../models/m-products');
const user = require('../models/m-user');

exports.postProducts = (req, res, next) => {
    d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });

    try {
        if (d.inputType == "Saree") {
            if (d.inputColorFlag) {
                const c = {
                    items: d.inputColor
                }
                let Products = new products({
                    images: d.inputImages,
                    name: d.inputName,
                    brandName: d.inputBrandName,
                    category: d.inputCategory,
                    price: d.inputPrice,
                    colors: c,
                    type: d.inputType,
                    quantity: d.inputQuantity,
                    fabric: d.inputFabric,
                    description: d.inputDescription,
                    catologue: d.inputCatologue,
                    storeId: d.inputStoreId,
                    colorFlag: true
                });
                Products.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({ status: true, message: "Product added." });
                        } else {
                            res.status(201).json({ status: false, message: "Something went wrong." });
                        }
                    }).catch(err => { console.log(err) });
            } else {
                let Products = new products({
                    images: d.inputImages,
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
                    storeId: d.inputStoreId,
                    colorFlag: false
                });
                Products.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({ status: true, message: "Product added." });
                        } else {
                            res.status(201).json({ status: false, message: "Something went wrong." });
                        }
                    }).catch(err => { console.log(err) });
            }
        } else {
            if (d.inputColorFlag) {
                const c = {
                    items: d.inputColor
                }
                let Products = new products({
                    images: d.inputImages,
                    name: d.inputName,
                    brandName: d.inputBrandName,
                    category: d.inputCategory,
                    price: d.inputPrice,
                    colors: c,
                    type: d.inputType,
                    quantity: d.inputQuantity,
                    fabric: d.inputFabric,
                    description: d.inputDescription,
                    catologue: d.inputCatologue,
                    storeId: d.inputStoreId,
                    s: d.inputSquantity,
                    m: d.inputMquantity,
                    l: d.inputLquantity,
                    xl: d.inputXLquantity,
                    xxl: d.inputXXLquantity,
                    xxl: d.inputXXXLquantity,
                    colorFlag: true
                });
                Products.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({ status: true, message: "Product added." });
                        } else {
                            res.status(201).json({ status: false, message: "Something went wrong." });
                        }
                    }).catch(err => { console.log(err) });
            } else {
                let Products = new products({
                    images: d.inputImages,
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
                    storeId: d.inputStoreId,
                    s: d.inputSquantity,
                    m: d.inputMquantity,
                    l: d.inputLquantity,
                    xl: d.inputXLquantity,
                    xxl: d.inputXXLquantity,
                    xxxl: d.inputXXXLquantity,
                    colorFlag: false
                });
                Products.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({ status: true, message: "Product added." });
                        } else {
                            res.status(201).json({ status: false, message: "Something went wrong." });
                        }
                    }).catch(err => { console.log(err) });
            }
        }
    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.getProducts = (req, res, next) => {
    const storeId = req.body.inputStoreId;
    if (!storeId) return res.status(201).json({ status: false, message: "Enter store id" });

    products.findOne({ storeId: storeId })
        .then(data => {
            if (data) {
                res.status(200).json({ status: true, data: data });
            } else {
                res.status(201).json({ status: false, message: "Something went wrong." });
            }
        }).catch(err => { console.log(err) });
}

exports.getSize = (req, res, next) => {
    arr = {
        S: "S", M: "M", L: "L", Xl: "XL", XXl: "XXL", XXXl: "XXXL"
    }
    res.status(200).json({
        data: arr
    })
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.body.inputProductId;
    if (!productId) return res.status(201).json({ status: false, message: "Enter product id" });
    products.findOne({_id: productId})
    .then(data=>{
        let im = data.images.split(',');
        let arr = {
            colors: data.colors,
            images: im,
            review: data.review,
            _id: data._id,
            name: data.name,
            brandName: data.brandName,
            category: data.category,
            price: data.price,
            type: data.type,
            quantity: data.quantity,
            fabric: data.fabric,
            description: data.description,
            catologue: data.catologue,
            storeId: data.storeId,
            colorFlag: data.colorFlag
        }
        res.status(200).json({
            data: arr
        })
    })
}

exports.postReview=(req, res, next) => {
    const d = req.body;
    if(!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    products.findOne({_id:d.productid})
    .then(data=>{
        var arr = data.review.items;
        arr.push({
            userId: d.userid,
            name: d.username,
            description: d.description,
            rating: d.rating
        });
        data.review.items = arr;
        data.save()
        .then(result=>{
            res.status(200).json({
                status: true
            })
        }).catch(err=>{console.log(err)});
    }).catch(err=>{console.log(err)});
}

exports.postGetReview = (req, res, next) => {
    const pid = req.body.productid;
    if(!pid) return res.status(201).json({ status: false, message: "Enter Proper Details" });

    products.findOne({_id: pid})
    .then(data=>{
        var arr = data.review.items;
        res.status(200).json({
            data: arr
        });
    }).catch(err=>{console.log(err)});
}