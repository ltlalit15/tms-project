const router = require("express").Router();
const { adminDashboard, agentDashboard, financeDashboard } = require("../controllers/dashboard.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Admin Dashboard
router.get("/admin", adminDashboard);

// Agent Dashboard
router.get("/agent/:agentId", agentDashboard);

router.get("/finance",  financeDashboard);


module.exports = router;
