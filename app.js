const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/" ,(req,res) => {
    res.send("Hi i am root");
});

// Index Route
app.get("/listings" , wrapAsync(async(req,res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs" , {allListings});
}));

// New Route
app.get("/listings/new" ,(req,res)=>{

    res.render("listings/new.ejs");
});

// Show Route
// app.get("/listings/:id",wrapAsync(async(req,res) =>{
//      let {id} = req.params;
//     const listing = await Listing.findById(id);
//     // console.log(listing);
//     res.render("listings/show.ejs",{listing});
// }));

// Show Route
app.get("/listings/:id",wrapAsync(async(req,res) =>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
    console.log(listing);
   res.render("listings/show.ejs",{listing});
}));

// Create Route
app.post("/listings",wrapAsync(async(req,res, next)=>{
    // let listing = req.body.listing;
    // new Listing(listing);
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for Listing");
    }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log(newListing);
        res.redirect("/listings");
   

} ));

// Edit Route
app.get("/listings/:id/edit" ,wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

// Update Route
app.put("/listings/:id" ,wrapAsync(async(req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for Listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// DElete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");

}));


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

app.use((err,req,res,next)=>{
let {statusCode = 500, message = "Something went Wrong!!"} =  err;
// res.status(statusCode).send(message);
res.status(statusCode).render("listings/error.ejs" , {err});
    // res.send("Something went wrong");
});

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
});

