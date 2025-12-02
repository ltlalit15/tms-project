// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     passwordHash: { type: String, required: true },
//     role: { type: String, enum: ["ADMIN", "FINANCE", "AGENT"], required: true },
//     agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },  // IMPORTANT
    role: { type: String, enum: ["ADMIN", "AGENT", "FINANCE"], default: "USER" },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
