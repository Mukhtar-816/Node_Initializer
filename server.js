const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth.Route.js");
const userRoutes = require("./routes/user.Route.js");
const connectDatabase = require("./config/db.js");
const errorMiddleware = require("./middleware/ErrorMiddleware.js");
//constants
const PORT = process.env.PORT || 5000;
const PROD = process.env.PROD || false;
const CORSOPTIONS = {
    origin: process.env.LOCAL_FRONTEND_URI || "http://localhost:5173",
    credentials: true
};


//creating server
const app = express();

//Built-In Middlewares
app.use(express.json()); //Parsing Json Data
app.use(cookieParser()); //Parsing Cookies
app.use(cors(CORSOPTIONS));    //Cross origin resource sharing
app.use(morgan('dev'));  //Logging Requests Endpoints


//Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);






//Health Check 
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        status: 200,
        message: "Dev Collab Api is running"
    });
});

// app.use("/*", (req, res) => {
//     res.send("Endpoint not found.");
// });

//Error Middleware
app.use(errorMiddleware);


// connect database then Listening to Server
connectDatabase()
    .then(() => {
        require("./config/redis.js");
    })
    .finally(() => {
        app.listen(PORT, "0.0.0.0", (req, res) => {
            console.log(`Server is running on Port : ${PORT}`)
        });
    })