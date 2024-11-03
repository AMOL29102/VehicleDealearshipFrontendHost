const express = require("express");
const serverlessExpress = require('@vendia/serverless-express'); // Import serverless-express
const logResReq = require("./log"); // Import without destructuring
const cors = require("cors");
const PORT = 8000

const app = express();

//routers
const HomeRoute = require("./routes/home.route.js");
const Imageroute = require("./routes/image.route.js");
const DetailsRoute = require("./routes/carDetails.route.js");
const SpecificPageRoute = require("./routes/specificCar.route.js");
const DeleteRecordRoute = require("./routes/deleteRecord.route.js");
const customerQueryRoute = require("./routes/customerQuery.route.js");
const LoginRoute = require("./adminRoutes/userLogin.route.js");
const RegistrationRoute = require("./adminRoutes/userRegistration.route.js");
const DashboardRoute = require("./adminRoutes/dashboard.route.js");
const InsuranceRoute = require("./adminRoutes/insurance.route.js");
const MaintainanceRoute = require("./adminRoutes/maintainance.route.js");
const InstallmentRoute = require("./adminRoutes/installments.route.js");

const corsOptions = {
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use your custom logging middleware
app.use(logResReq("logs.txt"));

// Using Routes
app.get("/",(req,res)=>{

    res.send("Hello server");
})
app.use("/landing", HomeRoute);
app.use("/upload", Imageroute);
app.use("/details", DetailsRoute);
app.use("/car", SpecificPageRoute);
app.use("/delete", DeleteRecordRoute);
app.use("/customer", customerQueryRoute);
app.use("/login", LoginRoute);
app.use("/register", RegistrationRoute);
app.use("/dashboard", DashboardRoute);
// app.use("/insurance", InsuranceRoute);
app.use("/maintainance", MaintainanceRoute);
app.use("/installments", InstallmentRoute);

// Export the handler for AWS Lambda
// exports.handler = serverlessExpress({ app });
// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports = app;