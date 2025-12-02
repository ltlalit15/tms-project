const router = require("express").Router();
const {
  getLedger,
  addManualLedger,
  getLedgerById,
  updateLedger,
  deleteLedger,
  getAllTransactions
} = require("../controllers/ledger.controller");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// List ledger
router.get("/",  getLedger);

// Get single ledger entry
router.get("/:id",  getLedgerById);

// Update ledger entry
router.put("/:id",  updateLedger);

// Delete ledger entry
router.delete("/:id",  deleteLedger);

router.get("/transactions/all", getAllTransactions);


// Manual ledger adjustment
router.post("/manual",  addManualLedger);

module.exports = router;
