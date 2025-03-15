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

// GET all records
router.get('/', getAllRecords);

// GET a single record by ID
router.get('/:id', getRecord);

// GET records by pet ID
router.get('/pet/:petId', getRecordsByPetId);

// POST create a new record
router.post('/', createRecord);

// PUT update a record
router.put('/:id', updateRecord);

// DELETE a record
router.delete('/:id', deleteRecord);

module.exports = router;