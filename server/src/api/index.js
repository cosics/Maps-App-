const express = require("express");

const emojis = require("./messages");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/messages", emojis);

module.exports = router;
