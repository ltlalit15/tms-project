const BulkTrip = require("../models/bulkTrip.model");
const Ledger = require("../models/ledger.model");
const Agent = require("../models/agent.model");

// CREATE BULK TRIP
exports.createBulkTrip = async (req, res) => {
  try {
    const bulkTrip = await BulkTrip.create(req.body);
    res.json({ success: true, message: "Bulk trip created", bulkTrip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL BULK TRIPS
exports.getBulkTrips = async (req, res) => {
  try {
    const trips = await BulkTrip.find()
      .populate("agentId")
      .sort({ createdAt: -1 });

    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE BULK TRIP
exports.getBulkTrip = async (req, res) => {
  try {
    const trip = await BulkTrip.findById(req.params.id).populate("agentId");
    if (!trip)
      return res.status(404).json({ success: false, message: "Bulk trip not found" });

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD ON-TRIP PAYMENT (diesel, toll, etc.)
exports.addOnTripPayment = async (req, res) => {
  try {
    const trip = await BulkTrip.findById(req.params.id);
    if (!trip)
      return res.status(404).json({ success: false, message: "Bulk trip not found" });

    trip.onTripPayments.push(req.body);
    await trip.save();

    res.json({ success: true, message: "On-trip payment added", trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD MID-PAYMENT (tyre, breakdown, service etc.)
exports.addMidPayment = async (req, res) => {
  try {
    const trip = await BulkTrip.findById(req.params.id);
    if (!trip)
      return res.status(404).json({ success: false, message: "Bulk trip not found" });

    trip.midPayments.push(req.body);

    // Recalculate total mid payments
    trip.totalMidPayments = trip.midPayments.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    await trip.save();

    res.json({ success: true, message: "Mid payment added", trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE LR RECEIVED STATUS
exports.updateLRReceivedStatus = async (req, res) => {
  try {
    const trip = await BulkTrip.findById(req.params.id);
    if (!trip)
      return res.status(404).json({ success: false, message: "Bulk trip not found" });

    trip.lrReceivedStatus = req.body.lrReceivedStatus; // RECEIVED / NOT_RECEIVED
    await trip.save();

    res.json({
      success: true,
      message: "LR received status updated",
      trip,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE BULK TRIP (Admin Only)
exports.deleteBulkTrip = async (req, res) => {
  try {
    const trip = await BulkTrip.findByIdAndDelete(req.params.id);

    if (!trip)
      return res.status(404).json({ success: false, message: "Bulk trip not found" });

    res.json({
      success: true,
      message: "Bulk trip deleted successfully",
      deletedTripId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
