const express = require("express");
const { handleUserRegistration } = require("../adminControllers/userRegistration.controller");

const router = express.Router();

router.get("/",(req,res)=>{
    res.json("Registration page")
})

router.post("/",handleUserRegistration);

module.exports = router;