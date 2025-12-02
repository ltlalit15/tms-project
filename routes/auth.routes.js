// const router = require("express").Router();
// const { register, login } = require("../controllers/auth.controller");
// const auth = require("../middleware/auth");
// const role = require("../middleware/role");


// router.post("/register", auth, role("ADMIN"), register);


// router.post("/login", login);

// module.exports = router;

const router = require("express").Router();
const {
  register,
  login,
  getUsers,
  getUser,
  deleteUser,
  updateUser
} = require("../controllers/auth.controller.js");

const auth = require("../middleware/auth.js");
const role = require("../middleware/role.js");

// Register (Admin Only)
router.post("/register", auth, role("ADMIN"), register);

// Login (Public)
router.post("/login", login);

// Get all users (Admin Only)
router.get("/users", getUsers);

// Get single user (Admin Only)
router.get("/users/:id",  getUser);

// Delete user (Admin Only)
router.delete("/users/:id",  deleteUser);
router.put("/users/:id",  updateUser);


module.exports = router;

