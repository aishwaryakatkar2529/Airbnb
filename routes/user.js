const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let{username , email , password} = req.body;
    // if (!username) {
    //     return res.status(400).send('Username is required');
    //   }
   const newUser = new User({ email , username });
   const registeredUser = await User.register( newUser , password );
//    console.log(registeredUser);

   //    Auto login passport method (callback)
   req.login(registeredUser,(err)=>{
    if(err) {
     return next(err);
    }
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
 });
    } catch(e){
        req.flash("error" ,e.message);
        res.redirect("/signup");
    }

}));

router.get("/login" ,(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login" ,saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true }),wrapAsync(async(req,res)=>{
    // res.send("Welcome to Wnaderlust! You are logged in!");
    req.flash("success" ,"Login successful!! ");
    // res.redirect("/listings");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));

router.get("/logout" ,(req,res) =>{
    // passport logout method (callback)
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success" ," you are logged out!");
        res.redirect("/listings");
    });
})
module.exports = router;
