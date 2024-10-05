const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema } = require("./schema.js");
const { reviewScehma } = require("./schema.js");

module.exports.isLoggedInOrNot = (req,res,next) =>{
    // console.log(req.path+".."+ req.originalUrl);
    // console.log(req.user);
    if(!req.isAuthenticated()){
        // redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","please login fisrt to creating a changes!!  Stay loggedin!!");
        return res.redirect("/login");
    }
    next();
}


// module.exports.isLoggedIn = (req,res,next) =>{
    
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error" ,"Listing you requested does not exists!");
//         res.redirect("/login");
//     }
//     next();
// }

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

 module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewScehma.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// module.exports.isOwner = async (req, res, next) => {
//     // let {id} = req.params;
//     // const listing = req.listing;  // Assuming listing is set in the request
//     const currUser = res.locals.currUser;  // Ensure currUser is accessed properly
//     // await Listing.findById(id);
//     // // Check for ownership
//     // if (!currUser || !listing.owner._id.equals(currUser._id)) {
//     //     req.flash('error',"Permission denied, As you are not a host of this listing!"); // Use a specific key for flash message
//     //     res.redirect(`/listings/${id}`); // Return immediately to prevent further processing
//     // }
//     // next(); // Proceed to the next middleware or route handler if the user is the owner
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     if(!currUser){
//         if(listing.owner.equals(res.locals.currUser._id)){
//         res.flash("error","You don't have permission to edit..");
//         return res.redirect(`listings/${id}`);
//     }}
//     next();
// };




// module.exports.isOwner = async (req, res, next) => {
//     let {id} = req.params;
//     // const listing = req.listing;  // Assuming listing is set in the request
//     const currUser = res.locals.currUser;  // Ensure currUser is accessed properly
//     // await Listing.findById(id);
//     let listing = await Listing.findById(id);
//     // Check for ownership
//     if (!currUser || !listing.owner._id.equals(currUser._id)) {
//         req.flash('error',"Permission denied, As you are not a host of this listing!"); // Use a specific key for flash message
//         return res.redirect(`/listings/${id}`); // Return immediately to prevent further processing
//     }
//     next(); // Proceed to the next middleware or route handler if the user is the owner
// };


// module.exports.isOwner = (req, res, next) => {
//     const listing = req.listing;  // Assuming listing is set in the request
//     const currUser = res.locals.currUser;  // Ensure currUser is accessed properly

//     // Check for ownership
//     if (!currUser || !listing.owner._id.equals(currUser._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect('/listings'); // Return immediately to prevent further processing
//     }
//     next(); // Proceed to the next middleware or route handler if the user is the owner
// };

