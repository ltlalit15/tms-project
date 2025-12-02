require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const agentRoutes = require("./routes/agent.routes");
const tripRoutes = require("./routes/trip.routes");
const bulkTripRoutes = require("./routes/bulkTrip.routes");
const ledgerRoutes = require("./routes/ledger.routes");
const disputeRoutes = require("./routes/dispute.routes");
const reportRoutes = require("./routes/report.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bulk-trips", bulkTripRoutes);
app.use("/api/ledger", ledgerRoutes)
app.use("/api/disputes", disputeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.send("TMS Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
