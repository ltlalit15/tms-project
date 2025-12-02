const router = require("express").Router();
const {
  createBulkTrip,
  getBulkTrips,
  getBulkTrip,
  addOnTripPayment,
  addMidPayment,
  updateLRReceivedStatus,
  deleteBulkTrip
} = require("../controllers/bulkTrip.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Create bulk trip
router.post("/",  createBulkTrip);

// List
router.get("/",  getBulkTrips);

// Get one
router.get("/:id", getBulkTrip);

// Add diesel/toll etc
router.post("/:id/on-trip-payments", addOnTripPayment);

// Add mid-payment
router.post("/:id/mid-payments", addMidPayment);

// Update LR received status
router.put("/:id/lr-received",  updateLRReceivedStatus);
// Delete bulk trip
router.delete("/:id",  deleteBulkTrip);


module.exports = router;
