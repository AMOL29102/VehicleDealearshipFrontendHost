const express = require("express");
const {generatePresignedUploadUrl} = require("../controllers/s3ImageUpload.controller.js");
const Imagerouter = express.Router();


Imagerouter.get('/generate-upload-url', generatePresignedUploadUrl);


module.exports = Imagerouter;
