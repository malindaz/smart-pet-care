const Pet = require('../Models/addnewpetmodel');



exports.addPet = async (req, res) => {
  try {
    console.log("📂 File received:", req.file); // Debugging
    console.log("📝 Form data:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const petData = req.body;
    petData.photoPath = req.file.path; // Save file path

    const newPet = new Pet(petData);
    await newPet.save();

    res.status(201).json(newPet);
  } catch (error) {
    console.error("❌ Error adding pet:", error);
    res.status(400).json({ message: error.message });
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


// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pet', error });
  }
};

