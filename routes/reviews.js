const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewScehma } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedInOrNot, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");

// Reviews
// Post Review Route 
router.post("/" ,isLoggedInOrNot,validateReview, wrapAsync (reviewController.createReview));


// Delete Review Route
router.delete("/:reviewID",isLoggedInOrNot,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;