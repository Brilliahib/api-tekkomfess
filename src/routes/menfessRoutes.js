const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const menfessController = require("../controllers/menfessController");

const router = express.Router();

// Route untuk registrasi user baru
router.get("/menfess", menfessController.getAllMenfess);

// Route untuk login user
router.post("/menfess", authMiddleware, menfessController.createMenfess);

router.get("/menfess/:id", menfessController.getMenfessById);

module.exports = router;
