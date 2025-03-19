const express = require('express');
const router = express.Router();
const petController = require('../controllers/addnewpetcontroller');


router.post('/add', petController.addPet);
router.get('/all', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.delete('/:id', petController.deletePet);
router.put('/:petId', petController.updatePet);

module.exports = router;



