const complaintModel = require("../models/complaintModel");
const userModel = require("../models/userModel");

exports.getComplaintList = (req, res) => {};

exports.postRegisterComplaint = async (req, res) => {
  try {
    const images = req.files.map((f) => ({
      url: "/uploads/complaints/" + f.filename,
    }));

    const { title, description, status, category, location } = req.body;
    const newComplaint = new complaintModel({
      title,
      description,
      status,
      category,
      location,
      images,
    });
    await newComplaint.save();

    const user = await userModel.findOne({ email: req.session.user.email });
    user.registeredComplaints.push(newComplaint._id);
    await user.save();
    req.session.user = user;

    return res.status(201).json({
      success: true,
      message: "Complaint is registered successfully",
      data: newComplaint,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to register the complaint",
      error: err.message,
    });
  }
};
