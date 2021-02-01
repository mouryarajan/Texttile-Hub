const products = require('../models/m-products');
const user = require('../models/m-user');
const store = require('../models/m-store');
const cat = require('../models/m-category');
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');

exports.postProducts = async (req, res, next) => {
    d = req.body;
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    });
    const st = await store.findOne({userId: id});
    if (!id) return res.status(201).json({ status: false, message: "Store not found" });
    if (!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    if (!st) return res.status(201).json({ status: false, message: "Store not found" });
    
    try {
        const catagoury = await cat.findOne({_id: d.inputCategory});
       // console.log(catagoury);
        if (catagoury.name == "Saree") {
            console.log("called");
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
                    primarycolor: d.inputPrimaryColor,
                    colors: c,
                    type: d.inputType,
                    quantity: d.inputQuantity,
                    fabric: d.inputFabric,
                    description: d.inputDescription,
                    catologue: d.inputCatologue,
                    storeId: st._id,
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
                    primarycolor: d.inputPrimaryColor,
                    type: d.inputType,
                    quantity: d.inputQuantity,
                    fabric: d.inputFabric,
                    description: d.inputDescription,
                    catologue: d.inputCatologue,
                    storeId: st._id,
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
                    primarycolor: d.inputPrimaryColor,
                    colors: c,
                    type: d.inputType,
                    quantity: d.inputQuantity,
                    fabric: d.inputFabric,
                    description: d.inputDescription,
                    catologue: d.inputCatologue,
                    storeId: st._id,
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
                    primarycolor: d.inputPrimaryColor,
                    type: d.inputType,
                    quantity: d.inputQuantity,
                    fabric: d.inputFabric,
                    description: d.inputDescription,
                    catologue: d.inputCatologue,
                    storeId: st._id,
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

exports.getProducts = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    });
    if (!id) return res.status(201).json({ status: false, message: "Enter store id" });
    const use = await store.findOne({userId: id});
    products.find({ storeId: use._id }).populate('brandName').populate('category').populate('type').populate('fabric')
        .then(data => {
            if (data) {
                res.status(200).json({ status: true, data: data });
            } else {
                res.status(201).json({ status: false, message: "Something went wrong." });
            }
        }).catch(err => { console.log(err) });
}

exports.postProductList = async (req, res, next) => {
    sid = req.body.inputStoreId;
    if (!sid) return res.status(201).json({ status: false, message: "Enter store id" });
    products.find({ storeId: sid }).populate('brandName').populate('category').populate('type').populate('fabric')
        .then(data => {
            if (data) {
                res.status(200).json({ status: true, data: data });
            } else {
                res.status(201).json({ status: false, message: "No data found" });
            }
        }).catch(err => { console.log(err) });
}

exports.removeProduct = (req, res, next) => {
    const pid = req.body.inputProductId;
    products.findByIdAndDelete(pid)
    .then(data=>{
        res.status(200).json({
            status:"true"
        })
    }).catch(err=>{conbsole.log(err)});
    
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
    products.findOne({_id: productId}).populate('brandName').populate('category').populate('type').populate('fabric')
    .then(data=>{
        res.status(200).json({
            data: data
        })
    })
}

exports.postReview = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    });
    if(!id) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    const d = req.body;
    if(!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    const use = await user.findOne({_id:id});
    products.findOne({_id:d.productid})
    .then(data=>{
        var arr = data.review.items;
        arr.push({
            userId: d.id,
            name: d.use.name.firstName,
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