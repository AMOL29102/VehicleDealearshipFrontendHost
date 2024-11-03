const express = require("express")
const {handleGetMaintainanceDetails,handlePostMaintainanceDetails} = require("../adminControllers/maintainance.controller")

const router = express.Router();


router.get("/",handleGetMaintainanceDetails);

router.post("/",handlePostMaintainanceDetails);

module.exports = router;