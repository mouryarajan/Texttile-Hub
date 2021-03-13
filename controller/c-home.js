const user = require('../models/m-user');
const products = require('../models/m-products');
const category = require('../models/m-category');
const store = require('../models/m-store');
const brand = require('../models/m-brand');
const fabric = require('../models/m-fabric');
const type = require('../models/m-type');
const trending = require('../models/m-tranding');
const itemPerPage = 1;
const fetch = require('node-fetch');
let base64 = require('base-64');
const { isDefined, isEmptyObject, decodeDataFromAccessToken, getAverage } = require('../handler/common');
const router = require('../routes/r-home');
const _ = require('lodash')

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

function isCherries(fruit) {
    return fruit.name === 'Black Saree';
}
exports.postSearchProductSample = async (req, res, next) => {
    const text = req.body.inputSearch;
    if (!text) { res.status(201).json({ status: false, message: "Provide text!" }) }
    const pro = await products.find().populate({ path: "brandName", select: { brandName: 1, _id: 0 } }).populate({ path: "category", select: { _id: 0, name: 1 } }).populate({ path: "type", select: { _id: 0, typeName: 1 } }).populate({ path: "fabric", select: { _id: 0, fabricName: 1 } }).populate({ path: "storeId", select: { companyName: 1, _id: 0 } }).select('brandName category type fabric storeId name primarycolor images price');
    let arr = [];

    let dataUsingProductName = pro.filter(function (e) {
        return e.name.toString().toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
    });

    let dataUsingBrandName = pro.filter(function (e) {
        return e.brandName.brandName.toString().toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
    });

    let dataUsingCategoryName = pro.filter(function (e) {
        return e.category.name.toString().toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
    });
    let dataUsingFabricName = pro.filter(function (e) {
        return e.fabric.fabricName.toString().toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
    });
    let dataUsingTypeName = pro.filter(function (e) {
        return e.type.typeName.toString().toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
    });
    let dataUsingStoreName = pro.filter(function (e) {
        return e.storeId.companyName.toString().toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
    });
    // let dataUsingColorName = pro.filter(function (e) {
    //     return e.primarycolor.toString().toLowerCase().indexOf(text)>-1;
    // });


    console.log(dataUsingStoreName.length)
    arr = [...dataUsingBrandName, ...dataUsingCategoryName, ...dataUsingProductName, ...dataUsingTypeName, ...dataUsingFabricName, ...dataUsingStoreName]

    let uniqueObject = {};
    let finalPro = []
    for (let i in arr) {
        objTitle = arr[i]['_id'];
        uniqueObject[objTitle] = arr[i];
    }
    for (i in uniqueObject) {
        finalPro.push(uniqueObject[i]);
    }
    //console.log(dataUsingCategoryName.length,dataUsingProductName.length)
    //console.log(arr)

    let finalArray = [];
    for (let i in finalPro) {
        console.log(finalPro[i]);
        finalArray.push({
            product:finalPro[i]._id,
            name:finalPro[i].name,
            image: finalPro[i].images.split(',')[0],
            price: finalPro[i].price
        })
    }
    res.status(200).json({
        data: finalArray
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

exports.payment = async (req, res, next) => {
    const amount = req.body.amount;
    const currency = req.body.currency;
    const receipt = req.body.receipt;
    const body = { amount: amount, currency: currency, receipt: receipt };

    let url = 'https://api.razorpay.com/v1/orders';
    let username = 'rzp_live_t67U0BoWeFiPpO';
    let password = '7lIb1BrxQvhZ6rJEFoZfEYMQ';

    let headers = new fetch.Headers();
    headers.append('Content-Type', 'text/json');
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
    })
        .then(response => response.json())
        .then(json => {
            //console.log(json)
            res.status(200).json({
                data: json
            });
        });

}

exports.postFilter = async (req, res, next) => {
    let searchKey = req.body;
    let priceClause = null;
    if (isDefined(searchKey.inputStartPrice) && isDefined(searchKey.inputEndPrice)) {
        priceClause = {
            price: {
                $gte: Number(searchKey.inputStartPrice),
                $lt: Number(searchKey.inputEndPrice)
            }
        }
    }
    if (isDefined(searchKey.inputBrandId)) {
        priceClause = {
            ...priceClause,
            brandName: { $in: searchKey.inputBrandId }
        }
    }
    if (isDefined(searchKey.inputStoreId)) {
        priceClause = {
            ...priceClause,
            storeId: { $in: searchKey.inputStoreId }
        }
    }
    if (isDefined(searchKey.inputCategouryId)) {
        priceClause = {
            ...priceClause,
            category: { $in: searchKey.inputCategouryId }
        }
    }
    if (isDefined(searchKey.inputTypeId)) {
        priceClause = {
            ...priceClause,
            type: { $in: searchKey.inputTypeId }
        }
    }
    if (isDefined(searchKey.inputFabricId)) {
        priceClause = {
            ...priceClause,
            fabric: { $in: searchKey.inputFabricId }
        }
    }
    if (isDefined(searchKey.inputColor)) {
        priceClause = {
            ...priceClause,
            primarycolor: { $in: searchKey.inputColor }
        }
    }
    //console.log(priceClause);
    const data = await products.find().populate({ path: 'storeId', select: 'isApproved' }).where(priceClause);

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

    if (data) {
        res.status(200).json({
            data: arr
        })
    } else {
        res.status(200).json({
            data: "NO product fount with this filter, Try another one!"
        })
    }

}

exports.postAdvertisement = (req, res, next) => {

}