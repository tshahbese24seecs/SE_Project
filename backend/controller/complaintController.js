// Core Modules
const fs = require("fs");
const path = require("path");

// Local Modules
const complaintModel = require("../models/complaintModel");
const userModel = require("../models/userModel");

exports.deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await complaintModel.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Delete images from disk
    complaint.images.forEach((img) => {
      const filePath = path.join(__dirname, "..", img.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await complaintModel.findByIdAndDelete(complaintId);

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting complaint",
      error: error.message,
    });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { complaintId } = req.params;

    const allowedStatuses = ["Pending", "In Progress", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint = await complaintModel.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating complaint status",
      error: error.message,
    });
  }
};

exports.getPersonalComplaintList = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.session.user.email })
      .populate("registeredComplaints");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user.registeredComplaints,
      message: "Your complaints have been fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllComplaintList = async (req, res) => {
  try {
    const complaints = await complaintModel.find();
    return res.status(200).json({
      success: true,
      data: complaints,
      message: "All Complaints have been fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getPendingComplaintList = async (_req, res) => {
  try {
    const complaints = await complaintModel.find({ status: { $in: [null, "pending", "Pending"] } });
    return res.status(200).json({
      success: true,
      data: complaints,
      message: "Pending complaints have been fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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
      error: err.message,
    });
  }
};

exports.updateComplaintStatus = (req, res) => {};

exports.getComplaintDetails = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const complaint = await complaintModel.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched the details of the complaint",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
