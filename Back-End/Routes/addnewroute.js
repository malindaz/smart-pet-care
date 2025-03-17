const express = require('express');
const router = express.Router();
const petController = require('../Controllers/addnewpetcontroller');

router.post('/add', petController.addPet);

module.exports = router;