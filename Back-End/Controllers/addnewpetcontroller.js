const Pet = require('../Models/addnewpetmodel');



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
      breed: req.body.breed,
      age: req.body.age,
      weight: req.body.weight,
      gender: req.body.gender,
      microchipID: req.body.microchipID,
      lastCheckup: req.body.lastCheckup,
      ownerName: req.body.ownerName,
      photo: req.file.path, 
    };

    const newPet = new Pet(petData);
    await newPet.save();

    res.status(201).json({ message: "Pet added successfully!", pet: newPet });
  } catch (error) {
    console.error("❌ Error adding pet:", error);
    res.status(500).json({ message: "Server error while adding pet", error: error.message });
  }
};




// Add a new pet
// exports.addPet = async (req, res) => {
//   try {
//     const newPet = new Pet(req.body);
//     await newPet.save();
//     res.status(201).json(newPet);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error });
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
    res.status(500).json({ message: 'Error fetching pet data', error });
  }
};

// Update pet details
exports.updatePet = async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(req.params.petId, req.body, { new: true });
    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pet', error });
  }
};


exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Delete associated pet image if exists
    if (pet.photo) {
      fs.unlink(pet.photo, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pet deleted successfully!" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Server error while deleting pet", error });
  }
};
