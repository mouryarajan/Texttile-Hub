const user = require('../models/m-user');
const products = require('../models/m-products');
const category = require('../models/m-category');
const store = require('../models/m-store');
const brand = require('../models/m-brand');
const fabric = require('../models/m-fabric');
const type = require('../models/m-type');
const trending = require('../models/m-tranding');
const itemPerPage = 1;
const { isDefined, isEmptyObject, decodeDataFromAccessToken, getAverage } = require('../handler/common');

exports.getHomeProducts = (req, res, next) => {
    const page = req.body.page;

    products.find().populate('brandName').populate('category').populate('type').populate('fabric').populate('storeId', 'isApproved')
        //.skip((page - 1) * itemPerPage)
        //.limit(itemPerPage)
        .then(data => {
            if (!isEmptyObject(data)) {
                let arr = [];
                for (let x of data) {
                    if (x.storeId.isApproved) {
                        let ima = x.images.toString();
                        let im = ima.split(',');
                        arr.push({
                            product: x._id,
                            name: x.name,
                            image: im[0],
                            price: x.price
                        });
                    }
                }
                res.status(200).json({
                    status: true,
                    data: arr
                });
            } else {
                res.status(201).json({
                    status: false,
                    message: "Oop's Products not found!"
                });
            }
        }).catch(err => { console.log(err) });
}

exports.postShopeByCategory = (req, res, next) => {
    const cat = req.body.inputCategoury;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({ category: cat }).populate('brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review')
        .then(data => {
            let arr = [];
            for (let x of data) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
            res.status(200).json({
                data: arr
            })
        }).catch(err => { console.log(err) });
}

exports.getStoreProduct = (req, res, next) => {
    const sid = req.body.inputStoreId;
    if (!sid) return res.status(201).json({ message: "Provide Store Id" });
    products.find({ storeId: sid }).populate('brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review')
        .then(data => {
            let arr = [];
            for (let x of data) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
            res.status(200).json({
                data: arr
            })
        }).catch(err => { console.log(err) });
}

exports.postShopeByType = (req, res, next) => {
    const cat = req.body.inputType;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({ type: cat }).populate('brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review')
        .then(data => {
            let arr = [];
            for (let x of data) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
            res.status(200).json({
                data: arr
            })
        }).catch(err => { console.log(err) });
}

exports.postShopeByBrand = (req, res, next) => {
    const cat = req.body.inputBrand;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({ brandName: cat }).populate('brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review')
        .then(data => {
            let arr = [];
            for (let x of data) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
            res.status(200).json({
                data: arr
            })
        }).catch(err => { console.log(err) });
}

exports.postShopeByFabric = (req, res, next) => {
    const cat = req.body.inputFabric;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({ fabric: cat }).populate('brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review')
        .then(data => {
            let arr = [];
            for (let x of data) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
            res.status(200).json({
                data: arr
            })
        }).catch(err => { console.log(err) });
}

exports.postSearchProduct = async (req, res, next) => {
    const text = req.body.inputSearch;
    if (!text) { res.status(201).json({ status: false, message: "Provide text!" }) }
    let arr = [];
    let finalPro = [];
    const prod = await products.find({ name: new RegExp(text, 'i') }).populate('brandName', 'brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review');
    const bran = await brand.findOne({ brandName: new RegExp(text, 'i') });
    const cat = await category.findOne({ name: new RegExp(text, 'i') });
    const fab = await fabric.findOne({ fabricName: new RegExp(text, 'i') });
    const typ = await type.findOne({ typeName: new RegExp(text, 'i') });
    const sto = await store.findOne({ companyName: new RegExp(text, 'i') })
    if (prod) {
        for (let x of prod) {
            if (x.storeId.isApproved) {
                let reviewData = x.review.items;
                let avgArray = [];
                reviewData.forEach((element) => {
                    avgArray.push(element.rating);
                });
                const avg = getAverage(avgArray);
                let ima = x.images.toString();
                let im = ima.split(',');
                arr.push({
                    product: x._id,
                    name: x.name,
                    price: x.price,
                    image: im[0],
                    brand: x.brandName.brandName,
                    description: x.description,
                    rating: avg
                })
            }
        }
    }
    if (cat) {
        const prod = await products.find({ category: cat._id }).populate('brandName', 'brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review');
        if (prod) {
            for (let x of prod) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
        }
    }
    if (fab) {
        const prod = await products.find({ fabric: fab._id }).populate('brandName', 'brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review');
        if (prod) {
            for (let x of prod) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
        }
    }
    if (typ) {
        const prod = await products.find({ type: typ._id }).populate('brandName', 'brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review');
        if (prod) {
            for (let x of prod) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
        }
    }
    if (bran) {
        const prod = await products.find({ brandName: bran._id }).populate('brandName', 'brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review');
        if (prod) {
            for (let x of prod) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
        }
    }
    if (sto) {
        const prod = await products.find({ storeId: sto._id }).populate('brandName', 'brandName').populate({ path: 'storeId', select: 'isApproved' }).select('storeId brandName name price images description review');
        if (prod) {
            for (let x of prod) {
                if (x.storeId.isApproved) {
                    let reviewData = x.review.items;
                    let avgArray = [];
                    reviewData.forEach((element) => {
                        avgArray.push(element.rating);
                    });
                    const avg = getAverage(avgArray);
                    let ima = x.images.toString();
                    let im = ima.split(',');
                    arr.push({
                        product: x._id,
                        name: x.name,
                        price: x.price,
                        image: im[0],
                        brand: x.brandName.brandName,
                        description: x.description,
                        rating: avg
                    })
                }
            }
        }
    }
    //console.log(pro);
    let uniqueObject = {};
    for (let i in arr) {
        objTitle = arr[i]['product'];
        uniqueObject[objTitle] = arr[i];
    }
    for (i in uniqueObject) {
        finalPro.push(uniqueObject[i]);
    }
    res.status(200).json({
        data: finalPro
    });
}

exports.getTrendingProduct = async (req, res, next) => {
    trending.find().populate({ path: 'productId' }).sort({ cart: 'desc' })
        .then(data => {
            let arr = [];
            for (let x of data) {
                let ima = x.productId.images.toString();
                let im = ima.split(',');
                arr.push({
                    product: x.productId._id,
                    name: x.productId.name,
                    image: im[0],
                    price: x.productId.price
                });
            }
            res.status(200).json({
                data: arr
            });
        })
}

exports.postFilter = async (req, res, next) => {
    
}

exports.postAdvertisement = (req, res, next) => {

}