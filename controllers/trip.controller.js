const Trip = require("../models/trip.model");
const Agent = require("../models/agent.model");
const Ledger = require("../models/ledger.model");

// CREATE TRIP
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.json({ success: true, message: "Trip created", trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL TRIPS
exports.getTrips = async (req, res) => {
  try {
    const filter = {};
    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.lrNo) filter.lrNo = req.query.lrNo;
    if (req.query.tripType) filter.tripType = req.query.tripType;

    const trips = await Trip.find(filter)
      .populate("agentId")
      .sort({ createdAt: -1 });

    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE TRIP
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("agentId");
    if (!trip)
      return res.status(404).json({ success: false, message: "Trip not found" });
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE TRIP
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Trip updated", trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.closeTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip)
      return res.status(404).json({ success: false, message: "Trip not found" });

    if (trip.isClosed)
      return res.status(400).json({ success: false, message: "Trip already closed" });

    // ⭐ STEP 1 — Update Trip Fields
    trip.onTripPayments = req.body.onTripPayments || trip.onTripPayments;
    trip.charges = req.body.charges || trip.charges;
    trip.betaCharges = req.body.betaCharges ?? trip.betaCharges;
    trip.lrReceived = req.body.lrReceived ?? trip.lrReceived;

    // ⭐ STEP 2 — Close Trip
    trip.isClosed = true;
    trip.closedAt = new Date();

    await trip.save();

    res.json({
      success: true,
      message: "Trip closed successfully",
      trip
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE TRIP (Admin Only)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip)
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });

    res.json({
      success: true,
      message: "Trip deleted successfully",
      deletedTripId: req.params.id
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
