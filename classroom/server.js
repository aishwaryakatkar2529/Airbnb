const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname, "views"));

const sessionOptions = {
    secret :"mysuperseceratestring",
    resave :false,
    saveUninitialized :true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.messages = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req,res) =>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    // res.send(`${name}`);
    if(name === "anonymous"){
        req.flash("error","user not registered");
    }else{
        // req.flash("success","user get registered");
        req.flash("success","user registered successfully!!");
    }    
    res.redirect("/hello" );
});

app.get("/hello" ,(req,res) =>{
    // console.log(req.flash("success"));
    // res.locals.messages = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    res.render("page.ejs" , {name : req.session.name });
})
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you send request ${req.session.count} times `);
// });

// app.get("/test",(req,res) =>{
//     res.send("test !!");
// });
// app.use(cookieParser("secrate"));

// app.get("/getSignedCookie" ,(req,res)=>{
//     res.cookie("color","red",{signed :true});
//     res.send("Signed cookie send");
// });

// app.get("/verify", (req,res) =>{
//     //console.log(req.cookies); //unsigned cookies
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// // cookie
// app.get("/getcookies" ,(req,res) =>{
//     res.cookie("greet" ,"Namste");
//     res.cookie("madeIn" ,"India");
//     res.send("sent you some cookie");
// });

// app.get("/greet",(req,res)=>{
//     let {name = "aditya"} = req.cookies;
//     res.send(`HI ${name}`);
// })


// app.get("/", (req,res)=>{
//     console.dir(req.cookies);
//     res.send("Root");
// });

// app.use("/users",users);
// app.use("/posts",posts);
 
app.listen(3000, () =>{
    console.log("Server is listening to port 3000");
});