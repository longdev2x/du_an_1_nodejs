var express = require('express');
var router = express.Router();
const Users = require('../models/users');
const Distributors = require('../models/distributors');
const Fruits = require('../models/fruits');
const Upload = require('../config/upload');




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
// Cập nhật distributor
router.put('/update_distributor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedDistributor = await Distributors.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (updatedDistributor) {
            res.json({ status: 200, msg: "Cập nhật thành công!", data: updatedDistributor });
        } else {
            res.json({ status: 400, msg: "Không tìm thấy Distributor!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ status: 500, msg: "Lỗi Server!" });
    }
});

// Xóa distributor
router.delete('/delete_distributor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Distributors.findByIdAndDelete(id);

        if (result) {
            res.json({ status: 200, msg: "Xóa thành công!" });
        } else {
            res.json({ status: 400, msg: "Không tìm thấy Distributor!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ status: 500, msg: "Lỗi Server!" });
    }
});


router.get('/get_list_fruit', async (req, res) => {
    try {
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            status: 200,
            msg: "Danh sách fruits",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            msg: "Lỗi Server!"
        });
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


router.post('/fruitWithImage', Upload.array('image',5),async (req,res) => {
    try{
        const data = req.body;
        const {files} = req;
        const urlsImage = files.map((file)=>`${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        const newFruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = (await newFruit.save()).populate('id_distributor');
        if(result){
            res.json({
                "status": 200,
                "msg":"Thêm thành công !!",
                "data": result
            });
        }else{
            res.json({
                "status":400,
                "msg":"Thêm không thành công !!",
                "data": []
            });
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