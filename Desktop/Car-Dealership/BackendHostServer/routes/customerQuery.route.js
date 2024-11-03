const express = require("express")
const {handleGetQuery,handleNewCustomerQuery,handleDeleteCustomerQuery} = require("../controllers/customerQuery.controller")


const customerReviewRouter = express.Router();

customerReviewRouter.get("/",handleGetQuery);

customerReviewRouter.post("/", handleNewCustomerQuery);

customerReviewRouter.delete("/", handleDeleteCustomerQuery  );


module.exports = customerReviewRouter;