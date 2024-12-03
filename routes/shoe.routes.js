const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe'); 

router.post('/', async (req, res) => {
  try {
    const shoe = new Shoe(req.body);
    await shoe.save();
    res.status(201).json(shoe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.status(200).json({
            status : 200,
            data: shoes,
        });
    } catch (e) {
        res.json(400).json({
            message: e.message
        });
    }
});

module.exports = router;
