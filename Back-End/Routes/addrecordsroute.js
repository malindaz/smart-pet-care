const express = require('express');
const router = express.Router();
const {
  getAllRecords,
  getRecord,
  getRecordsByPetId,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../Controllers/addrecordscontroller');


router.get('/', getAllRecords);


router.get('/:id', getRecord);


router.get('/pet/:petId', getRecordsByPetId);


router.post('/', createRecord);


router.put('/:id', updateRecord);


router.delete('/:id', deleteRecord);

module.exports = router;