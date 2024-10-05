const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewScehma } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedInOrNot} = require("../middleware.js");




// Reviews
// Post Review Route 
router.post("/" ,isLoggedInOrNot,validateReview, wrapAsync (async(req,res) =>{
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" ,"New Review Created Successfully!");


    // console.log("New review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);


}));


// Delete Review Route
router.delete("/:reviewID",wrapAsync(async(req,res) => {
    let {id,reviewID} = req.params;
    // console.log(id)
    // console.log(reviewID)
    await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success" ,"Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;