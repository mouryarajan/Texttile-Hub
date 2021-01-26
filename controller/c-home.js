const user = require('../models/m-user');
const products = require('../models/m-products');
const category = require('../models/m-category');
const store = require('../models/m-store');
const itemPerPage = 1;
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');

exports.getHomeProducts = (req, res, next)=>{
    const page = req.body.page;

    products.find()
    .skip((page-1)*itemPerPage)
    .limit(itemPerPage)
    .then(data=>{
        if(!isEmptyObject(data)){
            res.status(200).json({
                status: true,
                data: data
            });
        }else{
            res.status(201).json({
                status: false,
                message: "Oop's Products not found!"
            });
        }
    }).catch(err=>{console.log(err)});
}

exports.postShopeByCategory = (req, res, next) => {
    const cat = req.body.inputCategoury;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({category:cat})
    .then(data=>{
        res.status(200).json({
            data:data
        })
    }).catch(err=>{console.log(err)});
}

exports.postShopeByBrand = (req, res, next) => {
    const cat = req.body.inputBrand;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({brandName:cat})
    .then(data=>{
        res.status(200).json({
            data:data
        })
    }).catch(err=>{console.log(err)});
}

exports.postShopeByFabric = (req, res, next) => {
    const cat = req.body.inputFabric;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({fabric:cat})
    .then(data=>{
        res.status(200).json({
            data:data
        })
    }).catch(err=>{console.log(err)});
}

exports.postAdvertisement = (req, res, next) => {
    
}