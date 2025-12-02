const router = require("express").Router();
const {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  closeTrip,
  deleteTrip
} = require("../controllers/trip.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Create
router.post("/", createTrip);

// List
router.get("/", getTrips);

// Single trip
router.get("/:id", getTrip);

// Update
router.put("/:id",  updateTrip);

// Close trip
router.post("/:id/close",  closeTrip);

// Delete trip
router.delete("/:id", deleteTrip);

module.exports = router;
