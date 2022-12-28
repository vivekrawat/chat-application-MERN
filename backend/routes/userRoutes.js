const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  forgotPassword,
  resetCode,
  updatePassword
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetcode", resetCode)
router.post("/updatepassword", updatePassword)

module.exports = router;
