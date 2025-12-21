const express = require("express");
const adminRouter =  express.Router();
const complaintController = require("../controller/complaintController");
const { isAdmin } = require("../middleware/isAdmin");

adminRouter.get("/all", isAdmin, complaintController.getAllComplaintList);
adminRouter.post("/update", isAdmin, complaintController.updateComplaintStatus);
module.exports = adminRouter;