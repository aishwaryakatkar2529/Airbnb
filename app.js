if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
 

// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";
const dbUrl =process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store  = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
        secret : process.env.SECRATE
    },
    touchAfter : 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRATE,
    resave : false,
    saveUninitialized :true,
    cookie :{
        expires : Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
};

// app.get("/" ,(req,res) => {
//     res.send("Hi i am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    // console.log(res.locals.currUser);
    next();
});

// app.get("/demouser" ,async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username : "sigma-Student"
//     });

//     let registedUser = await User.register(fakeUser,"hello");
//     res.send(registedUser);
// });


app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews" ,reviewRouter );
app.use("/", userRouter);


// app.get("/testListing" , async (req,res) =>{
//     let sampleListing = new Listing({
//         title :"My home",
//         description :"By the beach",
//         price : 1200,
//         location :"Calangute",
//         country : "India",
//     });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// })

app.all("*" ,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

// app.use((err,req,res,next)=>{
// let {statusCode = 500, message = "Something went Wrong!!"} =  err;
// // res.status(statusCode).send(message);
// // res.status(statusCode).render("listings/error.ejs" , {err});
// res.status(statusCode).render("listings/error.ejs", { err: message });
//     // res.send("Something went wrong");
// });

// app.use((err, req, res, next) => {
//     // Destructure statusCode and message from the error object
//     let { statusCode = 500, message = "Something went wrong!" } = err;

//     // Check if headers have already been sent to avoid sending a second response
//     if (!res.headersSent) {
//         res.status(statusCode).render("listings/error.ejs", { err: message });
//     } else {
//         // If headers are already sent, pass the error to the next error handler
//         next(err);
//         // next(new ExpressError(404,"Page Not Found"));
//     }
// });


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
res.status(statusCode).render("listings/error.ejs", { message });
    
});

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
});

