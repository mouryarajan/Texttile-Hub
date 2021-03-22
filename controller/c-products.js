const products = require('../models/m-products');
const user = require('../models/m-user');
const store = require('../models/m-store');
const cat = require('../models/m-category');
const tranding = require('../models/m-tranding');
const Fabric = require('../models/m-fabric');
const Type = require('../models/m-type');
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');

exports.postProducts = async (req, res, next) => {
    d = req.body;
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    });
    const st = await store.findOne({ userId: id });
    if (!id) return res.status(201).json({ status: false, message: "Store not found" });
    if (!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    if (!st) return res.status(201).json({ status: false, message: "Store not found" });

    try {
        if (st.isApproved == true) {
            const catagoury = await cat.findOne({ _id: d.inputCategory });
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
                        s: {
                            quantity: d.inputSquantity,
                            price: d.inputSprice
                        },
                        m: {
                            quantity: d.inputMquantity,
                            price: d.inputMprice
                        },
                        l: {
                            quantity: d.inputLquantity,
                            price: d.inputLprice
                        },
                        xl: {
                            quantity: d.inputXLquantity,
                            price: d.inputXLprice
                        },
                        xxl: {
                            quantity: d.inputXXLquantity,
                            price: d.inputXXLprice
                        },
                        xxxl: {
                            quantity: d.inputXXXLquantity,
                            price: d.inputXXXLprice
                        },
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
                        s: {
                            quantity: d.inputSquantity,
                            price: d.inputSprice
                        },
                        m: {
                            quantity: d.inputMquantity,
                            price: d.inputMprice
                        },
                        l: {
                            quantity: d.inputLquantity,
                            price: d.inputLprice
                        },
                        xl: {
                            quantity: d.inputXLquantity,
                            price: d.inputXLprice
                        },
                        xxl: {
                            quantity: d.inputXXLquantity,
                            price: d.inputXXLprice
                        },
                        xxxl: {
                            quantity: d.inputXXXLquantity,
                            price: d.inputXXXLprice
                        },
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
        } else {
            res.status(201).json({
                status: false,
                message: 'You are not authorized to add product'
            })
        }

    } catch (err) {
        res.status(201).json({ err });
    }
}

exports.postEditProducts = async (req, res, next) => {
    const body = req.body;
    const pid = body.inputProductId;
    if (!pid) return res.status(201).json({ status: false, message: "Enter Product id" });
    products.findOne({ _id: pid })
        .then(data => {
            if (data) {
                if (body.inputProductImages) {
                    data.images = body.inputProductImages;
                }
                if (body.inputProductName) {
                    data.name = body.inputProductName;
                }
                if (body.inputBrandId) {
                    data.brandName = body.inputBrandId;
                }
                if (body.inputProductPrice) {
                    data.price = body.inputProductPrice;
                }
                if (body.inputType) {
                    const typ = await Type.findOne({typeName:body.inputType});
                    if(typ._id){
                        data.type = typ._id;
                    }
                }
                if (body.inputSquantity) {
                    data.s.quantity = body.inputSquantity;
                }
                if (body.inputSprice) {
                    data.s.price = body.inputSprice;
                }
                if (body.inputMquantity) {
                    data.m.quantity = body.inputMquantity;
                }
                if (body.inputMprice) {
                    data.m.price = body.inputMprice;
                }
                if (body.inputLquantity) {
                    data.l.quantity = body.inputLquantity;
                }
                if (body.inputLprice) {
                    data.l.price = body.inputLprice;
                }
                if (body.inputXLquantity) {
                    data.xl.quantity = body.inputXLquantity;
                }
                if (body.inputXLprice) {
                    data.xl.price = body.inputXLprice;
                }
                if (body.inputXXLquantity) {
                    data.xxl.quantity = body.inputXXLquantity;
                }
                if (body.inputXXLprice) {
                    data.xxl.price = body.inputXXLprice;
                }
                if (body.inputXXXLquantity) {
                    data.xxxl.quantity = body.inputXXXLquantity;
                }
                if (body.inputXXXLprice) {
                    data.xxxl.price = body.inputXXXLprice;
                }
                if (body.inputQuantity) {
                    data.quantity = body.inputQuantity;
                }
                if (body.inputFabric) {
                    const fab = await Fabric.findOne({fabricName:body.inputFabric});
                    if(fab._id){
                        data.fabric = fab._id;
                    }
                }
                if (body.inputDescription) {
                    data.description = body.inputDescription;
                }
                if (body.productColor) {
                    data.primarycolor = body.productColor;
                }
                data.save()
                res.status(200).json({
                    status: true
                })
            } else {
                res.status(201).json({ Message: "Product Not Found!" });
            }
        }).catch(err => {
            console.log(err);
            res.status(201).json({ err });
        })
}

exports.getProducts = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    });
    if (!id) return res.status(201).json({ status: false, message: "Enter store id" });
    const use = await store.findOne({ userId: id });
    products.find({ storeId: use._id }).populate('brandName').populate('category').populate('type').populate('fabric').populate({ path: 'storeId', select: 'isApproved' })
        .then(data => {
            if (data) {
                let arr = [];
                for (let x of data) {
                    if (x.storeId.isApproved) {
                        arr.push(x);
                    }
                }
                res.status(200).json({ status: true, data: arr });
            } else {
                res.status(201).json({ status: false, message: "Something went wrong." });
            }
        }).catch(err => { console.log(err) });
}

exports.postProductList = async (req, res, next) => {
    sid = req.body.inputStoreId;
    if (!sid) return res.status(201).json({ status: false, message: "Enter store id" });
    products.find({ storeId: sid }).populate('brandName').populate('category').populate('type').populate('fabric').populate({ path: 'storeId', select: 'isApproved' })
        .then(data => {
            if (data) {
                let arr = [];
                for (let x of data) {
                    if (x.storeId.isApproved) {
                        arr.push(x);
                    }
                }
                res.status(200).json({ status: true, data: arr });
            } else {
                res.status(201).json({ status: false, message: "No data found" });
            }
        }).catch(err => { console.log(err) });
}

exports.removeProduct = (req, res, next) => {
    const pid = req.body.inputProductId;
    products.findByIdAndDelete(pid)
        .then(async data => {
            await tranding.deleteMany({ productId: pid });
            res.status(200).json({
                status: "true"
            })
        }).catch(err => { conbsole.log(err) });

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
    products.findOne({ _id: productId }).populate('brandName', 'brandName').populate('category', 'name').populate('type', 'typeName').populate('fabric', 'fabricName').select('colors review images name brandName category price type quantity fabric description catologue colorFlag primarycolor quantity s m l xl xxl xxxl')
        .then(data => {
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
    if (!id) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    const d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Enter Proper Details" });
    const use = await user.findOne({ _id: id });
    products.findOne({ _id: d.productid })
        .then(data => {
            var arr = data.review.items;
            arr.push({
                userId: d.id,
                name: use.name.firstName,
                description: d.description,
                rating: d.rating
            });
            data.review.items = arr;
            data.save()
                .then(result => {
                    res.status(200).json({
                        status: true
                    })
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}

exports.postGetReview = (req, res, next) => {
    const pid = req.body.productid;
    if (!pid) return res.status(201).json({ status: false, message: "Enter Proper Details" });

    products.findOne({ _id: pid })
        .then(data => {
            var arr = data.review.items;
            res.status(200).json({
                data: arr
            });
        }).catch(err => { console.log(err) });
}