require("dotenv").config({ path: "./.env" });
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passport = require("passport");
const session = require("express-session");
const UserSchema = require("./models/user.schema");


require("./config/db");

var indexRouter = require("./routes/index.routes");

var userRouter = require("./routes/user.routes");

var app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));


app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());


app.use("/", indexRouter);

app.use("/user", userRouter);


app.use(function (req, res, next) {
    next(createError(404));
});


app.use(function (err, req, res, next) {
   
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

  
    res.status(err.status || 500);
    res.render("error", { title: "Expense Tracker | Error" });
});

module.exports = app;
