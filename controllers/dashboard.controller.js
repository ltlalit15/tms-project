const Trip = require("../models/trip.model");
const BulkTrip = require("../models/bulkTrip.model");
const Agent = require("../models/agent.model");
const Ledger = require("../models/ledger.model");
const Dispute = require("../models/dispute.model");


// =============================
//       ADMIN DASHBOARD
// =============================
exports.adminDashboard = async (req, res) => {
  try {
    const totalAgents = await Agent.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const closedTrips = await Trip.countDocuments({ isClosed: true });
    const pendingTrips = await Trip.countDocuments({ isClosed: false });

    // Today trips
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTrips = await Trip.countDocuments({ createdAt: { $gte: today } });

    // Bulk Trips
    const totalBulkTrips = await BulkTrip.countDocuments();
    const pendingLR = await BulkTrip.countDocuments({ lrReceivedStatus: "NOT_RECEIVED" });

    // Disputes
    const totalDisputes = await Dispute.countDocuments();
    const openDisputes = await Dispute.countDocuments({ status: { $ne: "RESOLVED" } });

    // Ledger Summary
    const ledger = await Ledger.find();

    const credit = ledger
      .filter(l => l.direction === "CREDIT")
      .reduce((sum, l) => sum + (l.amount || 0), 0);

    const debit = ledger
      .filter(l => l.direction === "DEBIT")
      .reduce((sum, l) => sum + (l.amount || 0), 0);

    const balance = credit - debit;

    // Agent balances
    const agents = await Agent.find();
    const totalAgentBalance = agents.reduce((sum, a) => sum + (a.remainingBalance || 0), 0);

    // Today ledger
    const todayLedger = ledger.filter(l => l.createdAt >= today).length;

    res.json({
      success: true,
      dashboard: {
        agents: {
          totalAgents,
          totalAgentBalance
        },
        trips: {
          total: totalTrips,
          closed: closedTrips,
          pending: pendingTrips,
          today: todayTrips
        },
        bulkTrips: {
          total: totalBulkTrips,
          pendingLR
        },
        disputes: {
          total: totalDisputes,
          open: openDisputes
        },
        ledgerSummary: {
          credit,
          debit,
          balance,
          todayTransactions: todayLedger
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// =============================
//       AGENT DASHBOARD
// =============================
exports.agentDashboard = async (req, res) => {
  try {
    const agentId = req.params.agentId;

    const agent = await Agent.findById(agentId);
    if (!agent)
      return res.status(404).json({ success: false, message: "Agent not found" });

    // Trips
    const trips = await Trip.find({ agentId });
    const closedTrips = trips.filter(t => t.isClosed).length;

    // Bulk Trips
    const bulkTrips = await BulkTrip.find({ agentId });
    const pendingLR = bulkTrips.filter(b => b.lrReceivedStatus === "NOT_RECEIVED").length;

    // Ledger
    const ledger = await Ledger.find({ agentId });

    const credit = ledger.filter(l => l.direction === "CREDIT")
                         .reduce((a, b) => a + b.amount, 0);

    const debit = ledger.filter(l => l.direction === "DEBIT")
                        .reduce((a, b) => a + b.amount, 0);

    const balance = credit - debit;

    res.json({
      success: true,
      dashboard: {
        agentDetails: agent,
        trips: {
          total: trips.length,
          closed: closedTrips,
          pending: trips.length - closedTrips,
        },
        bulkTrips: {
          total: bulkTrips.length,
          pendingLR
        },
        ledger: { credit, debit, balance }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.financeDashboard = async (req, res) => {
  try {
    const totalLedger = await Ledger.find();

    const today = new Date();
    today.setHours(0,0,0,0);

    const todayTransactions = totalLedger.filter(l => l.createdAt >= today).length;

    const credit = totalLedger.filter(l => l.direction === "CREDIT")
                              .reduce((a,b)=>a + b.amount,0);

    const debit = totalLedger.filter(l => l.direction === "DEBIT")
                             .reduce((a,b)=>a + b.amount,0);

    res.json({
      success: true,
      dashboard: {
        totalTransactions: totalLedger.length,
        todayTransactions,
        credit,
        debit,
        balance: credit - debit,
      }
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
