const user = require('../models/m-user');
const products = require('../models/m-products');
const category = require('../models/m-category');
const store = require('../models/m-store');
const brand = require('../models/m-brand');
const fabric = require('../models/m-fabric');
const type = require('../models/m-type');
const trending = require('../models/m-tranding');
const itemPerPage = 1;
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');

exports.getHomeProducts = (req, res, next) => {
    const page = req.body.page;

    products.find().populate('brandName').populate('category').populate('type').populate('fabric')
        .skip((page - 1) * itemPerPage)
        .limit(itemPerPage)
        .then(data => {
            if (!isEmptyObject(data)) {
                res.status(200).json({
                    status: true,
                    data: data
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
    products.find({ category: cat }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'})
        .then(data => {
            let arr = [];
            for(let x of data){
                if(data.storeId.isApproved){
                    arr.push(data)
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
    products.find({ type: cat }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'})
        .then(data => {
            let arr = [];
            for(let x of data){
                if(data.storeId.isApproved){
                    arr.push(data)
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
    products.find({ brandName: cat }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'})
        .then(data => {
            let arr = [];
            for(let x of data){
                if(data.storeId.isApproved){
                    arr.push(data)
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
    products.find({ fabric: cat }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'})
        .then(data => {
            let arr = [];
            for(let x of data){
                if(data.storeId.isApproved){
                    arr.push(data)
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
    let pro = [];
    let finalPro = [];
    const prod = await products.find({ name: new RegExp(text, 'i') }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'});
    const bran = await brand.findOne({brandName:new RegExp(text, 'i')});
    const cat = await category.findOne({ name: new RegExp(text, 'i') });
    const fab = await fabric.findOne({ fabricName: new RegExp(text, 'i') });
    const typ = await type.findOne({ typeName: new RegExp(text, 'i') });
    const sto = await store.findOne({companyName: new RegExp(text, 'i')})
    if (prod) {
        for (let x of prod) {
            if(x.storeId.isApproved){
                pro.push(x)
            }
        }
    }
    if (cat) {
        const prod = await products.find({ category: cat._id }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'});
        if (prod) {
            for (let x of prod) {
                if(x.storeId.isApproved){
                    pro.push(x)
                }
            }
        }
    }
    if (fab) {
        const prod = await products.find({ fabric: fab._id }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'});
        if (prod) {
            for (let x of prod) {
                if(x.storeId.isApproved){
                    pro.push(x)
                }
            }
        }
    }
    if (typ) {
        const prod = await products.find({ type: typ._id }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'});
        if (prod) {
            for (let x of prod) {
                if(x.storeId.isApproved){
                    pro.push(x)
                }
            }
        }
    }
    if (bran) {
        const prod = await products.find({ brandName: bran._id }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'});
        if (prod) {
            for (let x of prod) {
                if(x.storeId.isApproved){
                    pro.push(x)
                }
            }
        }
    }
    if (sto) {
        const prod = await products.find({ storeId: sto._id }).populate('brandName').populate('category').populate('type').populate('fabric').populate({path:'storeId',select:'isApproved'});
        if (prod) {
            for (let x of prod) {
                if(x.storeId.isApproved){
                    pro.push(x)
                }
            }
        }
    }
    //console.log(pro);
    let uniqueObject = {};
    for (let i in pro) {
        objTitle = pro[i]['_id'];
        uniqueObject[objTitle] = pro[i];
    }
    for (i in uniqueObject) {
        finalPro.push(uniqueObject[i]);
    }
    res.status(200).json({
        data: finalPro
    });
}

exports.getTrendingProduct = async (req, res, next) => {
    trending.find().populate({path:'productId'}).sort({cart:'desc'})
        .then(data => {
            let arr = [];
            for(let x of data){
                arr.push(x.productId);
            }
            res.status(200).json({
                data: arr
            });
        })
}

exports.postFilter = async (req, res, next) => {
    let typ = req.body.inputType;
    let cat = req.body.inputCategoury;
    let bran = req.body.inputBrand;
    let startPrice = req.body.inputStartPrice;
    let endPrice = req.body.inputEndPrice;
    let color = req.body.inputColor;
    let data;
    let arr = [];
    if (typ != 0 && cat == 0 && bran == 0 && startPrice == 0 && endPrice == 0 && color == 0) {
        cata = true;
    } else if (typ == 0 && cat != 0 && bran == 0 && startPrice == 0 && endPrice == 0 && color == 0) {

    } else if (typ == 0 && cat == 0 && bran != 0 && startPrice == 0 && endPrice == 0 && color == 0) {

    } else if (typ == 0 && cat == 0 && bran == 0 && startPrice != 0 && endPrice == 0 && color == 0) {

    } else if (typ == 0 && cat == 0 && bran == 0 && startPrice == 0 && endPrice != 0 && color == 0) {

    } else if (typ == 0 && cat == 0 && bran == 0 && startPrice == 0 && endPrice == 0 && color != 0) {

    }   
    data = isDefined(typ);
    res.status(200).json({ cata });
}

exports.postAdvertisement = (req, res, next) => {

}