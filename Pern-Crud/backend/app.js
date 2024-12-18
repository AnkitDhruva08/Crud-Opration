const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,            
    optionSuccessStatus: 200
}));

// Middleware
app.use(express.json());  // Only keep this line for JSON parsing
app.use(cookieParser());   // Cookie parser
app.use(bodyParser.urlencoded({extended: true}));  // Body parser for form data
app.use(fileUpload());  // File upload middleware

// Routes
const router = require("./src/routes/index");
app.use("/api/v1/", router);

// Start server
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
