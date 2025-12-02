const Agent = require("../models/agent.model");
const Ledger = require("../models/ledger.model");

// Create agent
exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.json({ success: true, message: "Agent created successfully", agent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({ success: true, agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single agent
exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent)
      return res.status(404).json({ success: false, message: "Agent not found" });
    res.json({ success: true, agent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update agent
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Agent updated", agent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete agent
exports.deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Agent deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get agent ledger + balance
exports.getAgentLedger = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent)
      return res.status(404).json({ success: false, message: "Agent not found" });

    const ledger = await Ledger.find({ agentId: agent._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      agent: {
        id: agent._id,
        name: agent.name,
        remainingBalance: agent.remainingBalance, // PDF rule – no "credit" word
      },
      ledger,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};