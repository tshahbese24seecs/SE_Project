const express = require("express");
const complaintRouter = express.Router();
const complaintController = require("../controller/complaintController");
const upload = require("../middleware/multerConfig");

complaintRouter.post(
  "/register",
  upload.array("images", 5),
  complaintController.postRegisterComplaint
);
complaintRouter.get(
  "/details/:complaintId",
  complaintController.getComplaintDetails
);
complaintRouter.get("/my", complaintController.getPersonalComplaintList);
