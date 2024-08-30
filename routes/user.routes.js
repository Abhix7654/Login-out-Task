const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user.schema");


const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(UserSchema.authenticate()));


router.get("/signup", async (req, res) => {
    res.render("signupuser", {
        title: "Expense Tracker | Signup",
        user: req.user,
    });
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await UserSchema.register({ username, email }, password);
      
        res.redirect("/user/signin");
    } catch (error) {
        next(error);
    }
});

router.get("/signin", async (req, res) => {
    res.render("signinuser", {
        title: "Expense Tracker | Signin",
        user: req.user,
    });
});


router.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/user/profile",
        failureRedirect: "/user/signin",
    }),
    (req, res) => {}
);

router.get("/profile", async (req, res) => {
    try {
        res.render("profileuser", {
            title: "Expense Tracker | Profile",
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/signout", async (req, res) => {
    req.logout(() => {
        res.redirect("/user/signin");
    });
});

module.exports = router;
