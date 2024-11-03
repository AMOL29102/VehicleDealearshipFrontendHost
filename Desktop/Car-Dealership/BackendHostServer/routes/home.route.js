const express = require("express");
const handleHomePage = require("../controllers/home.controller.js");

const router = express.Router();

router.get("/", handleHomePage); // This will call the updated handleHomePage function

module.exports = router;
