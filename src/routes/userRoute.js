const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/users", userController.getAllUsers);
router.get("/users/:uid", userController.getUserByUid);
router.get("/users/:uid/menfess", userController.getMenfessByUserId);

module.exports = router;
