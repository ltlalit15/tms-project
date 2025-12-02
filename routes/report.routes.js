const router = require("express").Router();
const {
  tripDetail,
  tripSummaryByAgent,
  bulkTripSummary,
  ledgerSummary,
  closingAudit
} = require("../controllers/report.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/trips/detail", tripDetail);
router.get("/trips/summary-by-agent",  tripSummaryByAgent);
router.get("/bulk-trips/summary",  bulkTripSummary);
router.get("/ledger/summary",  ledgerSummary);
router.get("/closing-audit",  closingAudit);

module.exports = router;
