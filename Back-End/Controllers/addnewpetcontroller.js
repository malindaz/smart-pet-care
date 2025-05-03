const Pet = require('../Models/addnewpetmodel');

const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();

exports.addPet = async (req, res) => {
  try {
    console.log("📂 File received:", req.file);
    console.log("📝 Form data:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const petData = {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed || "",
      age: req.body.age || 0,
      weight: req.body.weight || 0,
      gender: req.body.gender,
      microchipID: req.body.microchipID || "",
      lastCheckup: req.body.lastCheckup,
      ownerName: req.body.ownerName,
      photo: req.file.path.replace(/\\/g, '/'), 
    };

    const newPet = new Pet(petData);
    await newPet.save();

    res.status(201).json({ 
      message: "Pet added successfully!", 
      pet: newPet 
    });
  } catch (error) {
    console.error("❌ Error adding pet:", error);
    res.status(500).json({ 
      message: "Server error while adding pet", 
      error: error.message 
    });
  }
};

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
};


exports.getAllmedi = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
};
// Get a pet by ID
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pet data', error: error.message });
  }
};

// Update pet details
exports.updatePet = async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.petId, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pet', error: error.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    
    if (pet.photo) {
      const filePath = path.join(process.cwd(), pet.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pet deleted successfully!" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Server error while deleting pet", error: error.message });
  }
};


