const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, // Minimum length of 2 characters
    maxlength: 30, // Maximum length of 30 characters
  },
  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who liked the item
    default: [],
  },
  createdAt: {
    type: Date, // Corrected the type to Date
    format: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
