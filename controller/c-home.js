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
    const by = req.body.inputShopBy;
    const d = req.body;
    if(by=="category"){
        products.find({type: d.type})
        .then(data=>{
            res.status(200).json({
                data
            })
        })
    }
    if(by=="shop"){
        products.find({storeId: d.storeId})
        .then(data=>{
            res.status(200).json({
                data
            })
        })
    }
}

exports.postAdvertisement = (req, res, next) => {
    
}