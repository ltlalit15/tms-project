const Dispute = require("../models/dispute.model");

// CREATE DISPUTE (Agent / Finance)
// CREATE DISPUTE (Agent / Finance)
exports.createDispute = async (req, res) => {
  try {
    const dispute = await Dispute.create(req.body);
    res.json({ success: true, message: "Dispute created", dispute });
  } catch (error) {
    console.error("Dispute creation error:", error); // ✅ log the error
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL DISPUTES
exports.getDisputes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.status) filter.status = req.query.status;

    const disputes = await Dispute.find(filter)
      .populate("agentId")
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE DISPUTE
exports.getDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate("agentId")
      .populate("createdBy");

    if (!dispute)
      return res.status(404).json({ success: false, message: "Dispute not found" });

    res.json({ success: true, dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE DISPUTE STATUS (Admin / Finance)
exports.updateDisputeStatus = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute)
      return res.status(404).json({ success: false, message: "Dispute not found" });

    dispute.status = req.body.status;  // "IN_PROGRESS" / "RESOLVED"
    await dispute.save();

    res.json({ success: true, message: "Dispute status updated", dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE DISPUTE (Admin / Finance)
exports.deleteDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findByIdAndDelete(req.params.id);

    if (!dispute)
      return res.status(404).json({ success: false, message: "Dispute not found" });

    res.json({
      success: true,
      message: "Dispute deleted successfully",
      deletedDisputeId: req.params.id
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
