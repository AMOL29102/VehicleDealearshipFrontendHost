const express = require("express");
const { handleUserLogin } = require("../adminControllers/userRegistration.controller");
 

const router = express.Router()


router.get("/",(req,res)=>{
    res.json("Login Page")
})

router.post("/",handleUserLogin);

module.exports = router;