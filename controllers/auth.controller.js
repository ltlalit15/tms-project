const User = require("../models/user.model");
const Agent = require("../models/agent.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, agentId } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists)
//       return res.status(400).json({ success: false, message: "Email already used" });

//     const passwordHash = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       passwordHash,
//       role,
//       agentId: role === "AGENT" ? agentId : null,
//     });

//     res.json({ success: true, message: "User registered successfully", user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, code, openingBalance } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    // STEP 1: Create User
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    // STEP 2: If role is AGENT → Create agent automatically
    let agentData = null;

    if (role === "AGENT") {
      agentData = await Agent.create({
        name,
        phone,
        code,
        openingBalance,
        userId: user._id        // Link user → agent
      });

      // Update user with agentId
      user.agentId = agentData._id;
      await user.save();
    }

    res.json({
      success: true,
      message: "User registered successfully",
      user,
      agent: agentData
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        agentId: user.agentId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        agentId: user.agentId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL USERS (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE USER (Admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE USER (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.passwordHash;  

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated", user });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};











// const User = require("../models/user.model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // REGISTER
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, agentId } = req.body;

//     if (!name || !email || !password || !role)
//       return res.status(400).json({ success: false, message: "All fields required" });

//     const exist = await User.findOne({ email });
//     if (exist)
//       return res.status(400).json({ success: false, message: "Email already exists" });

//     const passwordHash = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       passwordHash,
//       role,
//       agentId: role === "AGENT" ? agentId : null
//     });

//     res.json({ success: true, message: "User registered", user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email & password required" });

//     const user = await User.findOne({ email });

//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid email or password" });

//     if (!user.passwordHash)
//       return res.status(500).json({ success: false, message: "User password is corrupted. Re-register user." });

//     const match = await bcrypt.compare(password, user.passwordHash);
//     if (!match)
//       return res.status(400).json({ success: false, message: "Invalid email or password" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role, agentId: user.agentId },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         agentId: user.agentId,
//       }
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
