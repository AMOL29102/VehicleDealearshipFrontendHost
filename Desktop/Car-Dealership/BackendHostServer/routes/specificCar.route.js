const express = require("express");
const handleSpecifiPage = require("../controllers/specificCar.controller.js");

router = express.Router();

router.get("/:registernumber", handleSpecifiPage);

module.exports = router;