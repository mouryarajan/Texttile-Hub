const category = require('../models/m-category');

exports.postCategory = (req, res, next) => {
    const Category = new category({
        name: req.body.inputCategoryName,
        image: req.body.inputImage
    });
    Category.save()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: true
                })
            } else {
                res.status(201).json({
                    status: false,
                    message: "Something went Worng"
                })
            }
        }).catch(err => { console.log(err) });
}

exports.postEditCategory = (req, res, next) => {
    const cid = req.body.inputCategoryId;
    const name = req.body.inputCategoryName;
    if (!cid) return res.status(201).json({ status: false, message: "Please Provide Proper Data" });

    category.findById(cid)
        .then(result => {
            if (result) {
                result.name = name;
                result.save()
                    .then(data => {
                        if (data) {
                            res.status(200).json({
                                status: true
                            })
                        } else {
                            res.status(201).json({
                                status: false,
                                message: "Something went Worng"
                            })
                        }
                    }).catch(err => { console.log(err) });
            }
        }).catch(err => { console.log(err) });
}

exports.getCategory = async (req, res, next) => {
    const data = await category.find();
    res.status(200).json({
        data: data
    });
}
