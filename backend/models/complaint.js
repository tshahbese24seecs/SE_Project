// External Modules
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title for the complaint"],
    trim: true,
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },

  category: {
    type: String,
    enum: [
      "Roads and Transport",
      "Street Lighting",
      "Waste Management",
      "Water and Sanitation",
    ],
    required: [true, "Please enter the category of the complaint"],
  },

  location: {
    type: String,
    required: [true, "Please enter the location of the complaint"],
  },

  images: [
    {
      url: { type: String, required: true },  // Path or Cloud URL
      uploadedAt: { type: Date, default: Date.now },
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
