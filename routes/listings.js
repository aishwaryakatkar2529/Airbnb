const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedInOrNot, isOwner , validateListing} = require("../middleware.js");

// Index Route
router.get("/" , wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
 }));
 
 // New Route
 router.get("/new" ,isLoggedInOrNot,(req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create a listing");
    //     return res.redirect("/login");
    // }
    // console.log(req.user);
     res.render("listings/new.ejs");
 });
 
 
//  // Show Route
// router.get("/:id",wrapAsync(async(req,res) =>{
//      let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews").populate("owner");
//      // console.log(listing);
//      if(!listing){
//         req.flash("error","Listing you requested does not exists!");
//         return res.redirect("/listings");
//      }
//     // console.log(listing);
//     res.render("listings/show.ejs",{listing});
//  }));
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate:{
            path : "author",
        },
    })
    .populate("owner");

  console.log(listing);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect(`/listings`); // Add return to prevent further execution
    }
    console.log(listing);

    res.render("listings/show.ejs", { listing });
}));



 // Create Route
router.post("/",isLoggedInOrNot,validateListing ,wrapAsync(async(req,res, next)=>{
    // let listing = req.body.listing;
    // new Listing(listing);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for Listing");
    // }
    //  let result = listingSchema.validate(req.body);
    //  console.log(result);
    //  if(result.error){
    //     throw new ExpressError(400,result.error);
    //  }
        const newListing = new Listing(req.body.listing);
        // if(!newListing.description){
        //     throw new ExpressError(400,"Description needs");
        // }

        // console.log(req.user);
        // who is the owner of new listing is stored in newListing.owner
        newListing.owner = req.user._id; //owners id 
        await newListing.save();
        req.flash("success" , "New Listing Created successfully!!");
        // console.log(newListing);
        res.redirect("/listings");
   

} ));

// Edit Route
// router.get("/:id/edit" ,isOwner,isLoggedIn,wrapAsync(async(req,res)=>{
//     let{id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("error" ,"Listing you requested does not exists!");
//          return res.redirect("/listings");
//      }
//     res.render("listings/edit.ejs" , {listing});
// }));
router.get("/:id/edit",isLoggedInOrNot,isOwner ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); // Add return to prevent further execution
    }

    res.render("listings/edit.ejs", { listing });
})); 

// router.get('/:id/edit', isOwner,isLoggedIn,wrapAsync(async (req, res) => {
//     const listing = req.listing; // The listing to edit
//     if (!listing) {
//         req.flash("error", "Listing you requested does not exist!");
//         return res.redirect("/listings"); // Add return to prevent further execution
//     }

//     res.render('listings/edit', { listing }); // Render the edit page with the listing data
// }));


// Update Route
router.put("/:id" ,isLoggedInOrNot,isOwner,validateListing,wrapAsync(async(req,res) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for Listing");
    // }
    let {id} = req.params;

    // let listing =  await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","you don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success" ,"Listing Updated Successfully!");

    res.redirect(`/listings/${id}`);
}));

// DElete Route
router.delete("/:id",isLoggedInOrNot,isOwner,wrapAsync(async(req,res)=>{
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log(deleteListing);
    req.flash("success" ,"Listing Deleted Successfully!");
    res.redirect("/listings");

}));

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema } = require("../schema.js");
// const Listing = require("../models/listing.js");
// const {isLoggedIn, isOwner} = require("../middleware.js");

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg= error.details.map((el)=>el.message).join(",");
//        throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }

// // Index Route
// router.get("/" , wrapAsync(async(req,res) =>{
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs" , {allListings});
//  }));
 
//  // New Route
//  router.get("/new" ,isLoggedIn,(req,res)=>{
//     // console.log(req.user);
//      res.render("listings/new.ejs");
//  });
 
 
// //  // Show Route
// // router.get("/:id",wrapAsync(async(req,res) =>{
// //      let {id} = req.params;
// //     const listing = await Listing.findById(id).populate("reviews").populate("owner");
// //      // console.log(listing);
// //      if(!listing){
// //         req.flash("error","Listing you requested does not exists!");
// //         return res.redirect("/listings");
// //      }
// //     // console.log(listing);
// //     res.render("listings/show.ejs",{listing});
// //  }));
// router.get("/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews").populate("owner");

//     if (!listing) {
//         req.flash("error", "Listing you requested does not exist!");
//         res.redirect(`/listings`); // Add return to prevent further execution
//     }

//     res.render("listings/show.ejs", { listing });
// }));



//  // Create Route
// router.post("/",isLoggedIn,validateListing ,wrapAsync(async(req,res, next)=>{
//     // let listing = req.body.listing;
//     // new Listing(listing);
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for Listing");
//     // }
//     //  let result = listingSchema.validate(req.body);
//     //  console.log(result);
//     //  if(result.error){
//     //     throw new ExpressError(400,result.error);
//     //  }
//         const newListing = new Listing(req.body.listing);
//         // if(!newListing.description){
//         //     throw new ExpressError(400,"Description needs");
//         // }

//         // console.log(req.user);
//         newListing.owner = req.user._id;
//         await newListing.save();
//         req.flash("success" , "New Listing Created successfully!!");
//         // console.log(newListing);
//         res.redirect("/listings");
   

// } ));

// // Edit Route
// // router.get("/:id/edit" ,isOwner,isLoggedIn,wrapAsync(async(req,res)=>{
// //     let{id} = req.params;
// //     const listing = await Listing.findById(id);
// //     if(!listing){
// //         req.flash("error" ,"Listing you requested does not exists!");
// //          return res.redirect("/listings");
// //      }
// //     res.render("listings/edit.ejs" , {listing});
// // }));
// router.get("/:id/edit" , isLoggedIn,isOwner, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);

//     if (!listing) {
//         req.flash("error", "Listing you requested does not exist!");
//         res.redirect("/listings"); // Add return to prevent further execution
//     }

//     res.render("listings/edit.ejs", { listing });
// })); 

// // router.get('/:id/edit', isOwner,isLoggedIn,wrapAsync(async (req, res) => {
// //     const listing = req.listing; // The listing to edit
// //     if (!listing) {
// //         req.flash("error", "Listing you requested does not exist!");
// //         return res.redirect("/listings"); // Add return to prevent further execution
// //     }

// //     res.render('listings/edit', { listing }); // Render the edit page with the listing data
// // }));


// // Update Route
// router.put("/:id" ,isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res) =>{
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for Listing");
//     // }
//     let {id} = req.params;
//     // let listing = await Listing.findById(id);
//     // if(!currUser && !listing.owner._id.equals(res.locals.currUser._id)){
//     //     req.flash("error","You Don't have permission to edit");
//     //    return  res.redirect(`listings/${id}`);
//     // }

//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     req.flash("success" ,"Listing Updated Successfully!");

//     res.redirect(`/listings/${id}`);
// }));

// // DElete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
//     let{id} = req.params;
//     let deleteListing = await Listing.findByIdAndDelete(id);
//     // console.log(deleteListing);
//     req.flash("success" ,"Listing Deleted Successfully!");
//     res.redirect("/listings");

// }));

// module.exports = router;