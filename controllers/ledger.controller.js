const Ledger = require("../models/ledger.model");
const Agent = require("../models/agent.model");

// GET LEDGER LIST
exports.getLedger = async (req, res) => {
  try {
    const filter = {};

    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.lrNo) filter.lrNo = req.query.lrNo;
    if (req.query.type) filter.type = req.query.type;

    if (req.query.dateFrom && req.query.dateTo) {
      filter.createdAt = {
        $gte: new Date(req.query.dateFrom + "T00:00:00.000Z"),
        $lte: new Date(req.query.dateTo + "T23:59:59.999Z")
      };
    }

    const ledger = await Ledger.find(filter)
      .populate("agentId")
      .sort({ createdAt: -1 });

    res.json({ success: true, ledger });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD MANUAL LEDGER ENTRY (FIX ADDED)
exports.addManualLedger = async (req, res) => {
  try {
    const entry = await Ledger.create(req.body);

    await updateAgentBalance(req.body.agentId); // ⭐ VERY IMPORTANT

    res.json({ success: true, message: "Manual ledger entry added", entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE LEDGER ENTRY
exports.deleteLedger = async (req, res) => {
  try {
    const entry = await Ledger.findByIdAndDelete(req.params.id);

    if (!entry)
      return res.status(404).json({ success: false, message: "Ledger entry not found" });

    await updateAgentBalance(entry.agentId); // ⭐ AFTER DELETE

    res.json({
      success: true,
      message: "Ledger entry deleted successfully",
      deletedId: req.params.id
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE LEDGER ENTRY
exports.updateLedger = async (req, res) => {
  try {
    const entry = await Ledger.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!entry)
      return res.status(404).json({ success: false, message: "Ledger entry not found" });

    await updateAgentBalance(entry.agentId); // ⭐ UPDATE BALANCE

    res.json({ success: true, message: "Ledger entry updated", entry });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// GET SINGLE LEDGER ENTRY BY ID
exports.getLedgerById = async (req, res) => {
  try {
    const entry = await Ledger.findById(req.params.id).populate("agentId");

    if (!entry)
      return res.status(404).json({ success: false, message: "Ledger entry not found" });

    res.json({ success: true, entry });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


async function updateAgentBalance(agentId) {
  const ledger = await Ledger.find({ agentId });

  const credit = ledger
    .filter(l => l.direction === "CREDIT")
    .reduce((a, b) => a + b.amount, 0);

  const debit = ledger
    .filter(l => l.direction === "DEBIT")
    .reduce((a, b) => a + b.amount, 0);

  const balance = credit - debit;

  await Agent.findByIdAndUpdate(agentId, { remainingBalance: balance });
}



exports.getAllTransactions = async (req, res) => {
  try {
    const filter = {};

    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.type) filter.type = req.query.type;  // BETA, MID_PAYMENT, TRIP_DEDUCTION, etc.
    if (req.query.direction) filter.direction = req.query.direction; // CREDIT/DEBIT

    if (req.query.dateFrom && req.query.dateTo) {
      filter.createdAt = {
        $gte: new Date(req.query.dateFrom + "T00:00:00.000Z"),
        $lte: new Date(req.query.dateTo + "T23:59:59.999Z")
      };
    }

    const transactions = await Ledger.find(filter)
      .populate("agentId")
      .populate("bulkTripId")
      .sort({ createdAt: -1 });

    const formatted = transactions.map(t => ({
      date: t.createdAt.toISOString().split("T")[0],
      agent: t.agentId?.name,
      lrNo: t.lrNo || "—",
      bulkTripId: t.bulkTripId?.bulkTripCode || "—",
      type: t.type,
      direction: t.direction,
      amount: t.amount,
      mode: t.mode,
      bank: t.bank,
      description: t.description
    }));

    res.json({ success: true, transactions: formatted });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
