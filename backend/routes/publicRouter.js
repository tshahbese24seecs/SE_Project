const express = require("express");
const publicRouter = express.Router();
const complaintController = require("../controller/complaintController");

// Public endpoint: list pending complaints
publicRouter.get("/pending", complaintController.getPendingComplaintList);

module.exports = publicRouter;
