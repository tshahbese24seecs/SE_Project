// External Modules
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    trim: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: [true, "Password is required"] },
  role: {
    type: String,
    enum: ["citizen", "administration"],
    default: "citizen",
  },
  registeredComplaints: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  ],
});

module.exports = mongoose.model("User", userSchema);
