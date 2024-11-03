const express = require("express");

const {addInstallments, getInstallments} = require('../adminControllers/installment.controller.js')

const router = express.Router();

router.post("/", addInstallments);
router.get("/", getInstallments);

module.exports = router