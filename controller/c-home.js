const user = require('../models/m-user');
const products = require('../models/m-products');
const category = require('../models/m-category');
const store = require('../models/m-store');
const brand = require('../models/m-brand');
const fabric = require('../models/m-fabric');
const type = require('../models/m-type');
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
    products.find({category:cat}).populate('brandName').populate('category').populate('type').populate('fabric')
    .then(data=>{
        res.status(200).json({
            data:data
        })
    }).catch(err=>{console.log(err)});
}

exports.postShopeByBrand = (req, res, next) => {
    const cat = req.body.inputBrand;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({brandName:cat}).populate('brandName').populate('category').populate('type').populate('fabric')
    .then(data=>{
        res.status(200).json({
            data:data
        })
    }).catch(err=>{console.log(err)});
}

exports.postShopeByFabric = (req, res, next) => {
    const cat = req.body.inputFabric;
    if (!cat) return res.status(201).json({ message: "Provide proper details" });
    products.find({fabric:cat}).populate('brandName').populate('category').populate('type').populate('fabric')
    .then(data=>{
        res.status(200).json({
            data:data
        })
    }).catch(err=>{console.log(err)});
}

exports.postSearchProduct = async (req, res, next) => {
    const text = req.body.inputSearch;
    if(!text){res.status(201).json({status:false,message:"Provide text!"})}
    let pro = [];
    let finalPro = [];
    const prod = await products.find({ name: new RegExp(text, 'i')});
    const cat = await category.findOne({ name: new RegExp(text, 'i')});
    const fab = await fabric.findOne({fabricName: new RegExp(text, 'i')});
    const typ = await type.findOne({typeName: new RegExp(text, 'i')});
    if(prod){
        for(let x of prod){
            pro.push({
                id: x._id,
                name: x.name,
                image: x.primarycolor,
                description: x.description,
                price: x.price 
            })
        }
    }
    if(cat){
        const prod = await products.find({ category: cat._id});
        if(prod){
            for(let x of prod){
                pro.push({
                    id: x._id,
                    name: x.name,
                    image: x.primarycolor,
                    description: x.description,
                    price: x.price,
                    demo: "demo"
                })
            }
        }
    }
    if(fab){
        const prod = await products.find({ fabric: fab._id});
        if(prod){
            for(let x of prod){
                pro.push({
                    id: x._id,
                    name: x.name,
                    image: x.primarycolor,
                    description: x.description,
                    price: x.price 
                })
            }
        }
    }
    if(typ){
        const prod = await products.find({ type: typ._id});
        if(prod){
            for(let x of prod){
                pro.push({
                    id: x._id,
                    name: x.name,
                    image: x.primarycolor,
                    description: x.description,
                    price: x.price 
                })
            }
        }
    }
    let uniqueObject = {}; 
    for (let i in pro) { 
        objTitle = pro[i]['id']; 
        uniqueObject[objTitle] = pro[i]; 
    }
    for (i in uniqueObject) { 
        finalPro.push(uniqueObject[i]); 
    } 
    res.status(200).json({
        data:finalPro
    });
}

exports.postAdvertisement = (req, res, next) => {
    
}