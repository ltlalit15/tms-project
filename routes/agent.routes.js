const router = require("express").Router();
const {
  createAgent,
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent,
  getAgentLedger,
} = require("../controllers/agent.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Routes
router.post("/",  createAgent);
router.get("/",  getAgents);
router.get("/:id", getAgent);
router.put("/:id",  updateAgent);
router.delete("/:id", deleteAgent);

// Ledger overview for specific agent
router.get("/:id/ledger", auth, role("ADMIN", "FINANCE"), getAgentLedger);

module.exports = router;
