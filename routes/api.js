var express = require('express');
var router = express.Router();
const Users = require('../models/users');
const Distributors = require('../models/distributors');
const Fruits = require('../models/fruits');


router.get('/getListDistributor', async (req, res) => {
    try {
        const data = await Distributors.find().populate();
        res.json({
            "status": 200,
            "messenger": "Danh sách distributor",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

//Thêm model
router.post('/add_distributor',async (req,res) => {
    try{
        const data = req.body;
        const newDistributor = new Distributors({
            name: data.name
        });
        const result = await newDistributor.save();
        if(result){
            const list = await Distributors.find().populate();
            res.json({
                "status":200,
                "msg":"Thêm thành công !!",
                "data": list
            });
        }
        else{
            res.json({
                "status":400,
                "msg":"Lỗi, thêm không thành công !!",
                "data": []
            })
        }
    }catch(error){
        console.log(error);
    }
});


//API Thêm Fruit
router.post('/add_fruit', async (req,res) =>{
    try{
        const data = req.body;
        const newFruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newFruit.save();
        if(result){
            res.json({
                "status":200,
                "msg":"Thêm thành công !!",
                "data": result
            });
        }
        else{
            res.json({
                "status":400,
                "msg":"Lỗi, thêm không thành công !!",
                "data": []
            })
        }
    }catch(error){
        console.log(error);
    }
});

router.get('/get_list_fruit', async(req,res) =>{
    try{
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status":200,
                "msg":"Thêm thành công !!",
                "data": data
        });
    }catch(error){
        console.log(error);
    }
});


router.get('/get_fruitById/:id', async(req,res) =>{
    try{
        const {id} = req.params;
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status":200,
            "msg":"Thêm thành công !!",
            "data": data
        });
    }catch(error){
        console.log(error);
    }
});
module.exports = router;