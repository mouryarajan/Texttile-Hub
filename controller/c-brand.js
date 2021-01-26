const brand = require('../models/m-brand');
const brandstore = require('../models/m-brand-store');
const category = require('../models/m-category');
const fabric = require('../models/m-fabric');
const type = require('../models/m-type');
const { isDefined, isEmptyObject, decodeDataFromAccessToken } = require('../handler/common');

exports.postBrand = async (req, res, next) => {
    let id;
    await decodeDataFromAccessToken(req.headers.token).then((data) => {
        id = data.userId;
    });
    const name = req.body.inputBrandName;
    brand.findOne({brandName: name})
    .then(data=>{
        if(data){
            const BrandStore = new brandstore({
                brandid: data._id,
                userid: id
            });
            BrandStore.save();
            res.status(200).json({
                status: true
            })
        }else{
            const Brand = new brand({
                brandName: name
            });
            Brand.save()
            .then(result=>{
                const BrandStore = new brandstore({
                    brandid: result._id,
                    userid: id
                }); 
                BrandStore.save();
                res.status(200).json({
                    status: true
                })
            });
            
        }
    }).catch(err=>{console.log(err);});
}

exports.postType = (req, res, next) =>{
    const name = req.body.inputType;
    const Type = new type({
        typeName: name
    });
    Type.save()
    .then(data=>{
        res.status(200).json({
            status: true
        });
    }).catch(err=>{console.log(err);});
}

exports.postFabric = (req, res, next) =>{
    const name = req.body.inputFabric;
    const Fabric = new fabric({
        fabricName: name
    });
    Fabric.save()
    .then(data=>{
        res.status(200).json({
            status: true
        });
    }).catch(err=>{console.log(err);});
}

exports.autoComplete = async (req, res, next) => {
    const cat = await category.find();
    const brandList = await brand.find();
    const typeList = await type.find();
    const fabricList = await fabric.find();
    let cata = [];
    let bran = [];
    let ty = [];
    let fab = [];
    for(let x of cat){
        let y = x._id + "#" + x.name;
        cata.push(y)
    }
    for(let x of brandList){
        let y = x._id + "#" + x.brandName;
        bran.push( y)
    }
    for(let x of typeList){
        let y = x._id + "#" + x.typeName;
        ty.push( y)
    }
    for(let x of fabricList){
        let y = x._id + "#" + x.fabricName;
        fab.push( y)
    }

    res.send({
        category: cata,
        brand: bran,
        type: ty,
        fabric: fab
    })
} 

