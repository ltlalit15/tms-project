const router = require("express").Router();
const { createDispute, getDisputes, getDispute, updateDisputeStatus, deleteDispute} = require("../controllers/dispute.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Raise dispute (AGENT + FINANCE + ADMIN)
router.post("/", createDispute);

// All disputes list
router.get("/",  getDisputes);

// View single dispute
router.get("/:id",  getDispute);

// Update status (FINANCE + ADMIN only)
router.put("/:id", updateDisputeStatus);

// Delete dispute (Admin + Finance)
router.delete("/:id", deleteDispute);


module.exports = router;
