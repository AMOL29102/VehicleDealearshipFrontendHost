const express = require("express");
const handleRecordDeletion = require("../controllers/deleteRecord.controller");
const handleDashboard = require("../adminControllers/dashboard.controller");
const {handleSellCar, getSoldCarDetails} = require("../adminControllers/sellcar.controller")
const {handleDeleteNotice,handleGetNotice}= require("../controllers/addNotice.controller")
const upload = require("../middlewares/multer.middleware.js");

const { authenticateToken, authorizeAdmin } = require("../controllers/userRole-auth");

const router = express.Router();

// router.get("/" ,authenticateToken,authorizeAdmin,handleDashboard);
router.get("/" ,handleDashboard);

router.post("/sell-car",handleSellCar);


router.get("/get-notice",handleGetNotice);
router.delete("/delete-notice",handleDeleteNotice)
router.get("/sold-cars", getSoldCarDetails)

module.exports = router;