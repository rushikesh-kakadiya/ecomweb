/* eslint-disable no-undef */
const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const routes = require("./router")
const cors = require("cors");
const corsOptions = {
  origin: ['http://localhost:5173', 'https://ecomwebf.netlify.app'],
  credentials: true,
  exposedHeaders: ["Access-Control-Allow-Headers", "Access-Control-Allow-Methods"],
};

app.use(cors(corsOptions));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname + "/public")));

app.use("/api",routes)



module.exports = app;