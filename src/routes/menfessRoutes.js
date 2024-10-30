const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const menfessController = require("../controllers/menfessController");

const router = express.Router();

const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

router.get("/menfess", menfessController.getAllMenfess);
router.post(
  "/menfess",
  authMiddleware,
  upload.array("images"),
  menfessController.createMenfess
);
router.post(
  "/menfess/:id/comment",
  authMiddleware,
  menfessController.addCommentToMenfess
);
router.get("/menfess/:id", menfessController.getMenfessById);

module.exports = router;
