const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router
.route("/signup")
.get((userController.renderSignupFrom))
.post(wrapAsync(userController.signup));


router
.route("/login")
.get(userController.renderLoginFrom)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash: true }),
    wrapAsync(userController.login)
);


// signup get reqest
// router.get("/signup",(userController.renderSignupFrom));

// signup post request
// router.post("/signup", wrapAsync(userController.signup));

// login Route
// router.get("/login", userController.renderLoginFrom);

// login
// router.post("/login" ,
//     saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:"/login",failureFlash: true }),
//     wrapAsync(userController.login)
// );

// logout
router.get("/logout" ,(userController.logout));

module.exports = router;
