const Listing = require("./models/listing");

module.exports.isLoggedIn = (req,res,next) =>{
    // console.log(req.path+".."+ req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" ,"Listing you requested does not exists!");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// module.exports.isOwner = async(req,res,next)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     console.log(res.locals.currUser);
//     if(!currUser && !listing.owner._id.equals(res.locals.currUser)){
//         req.flash("error","You Don't have permission to edit");
//        return  res.redirect(`listings/${id}`);
//     }
//     next();
// }

// module.exports.isOwner = (req, res, next) => {
//     const listing = req.listing;  // Assuming listing is set in request
//     const currUser = res.locals.currUser;  // Ensure currUser is accessed properly

//     if (!currUser || !listing.owner._id.equals(currUser._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect('/listings');
//     }
//     next();
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

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    const listing = req.listing;  // Assuming listing is set in the request
    const currUser = res.locals.currUser;  // Ensure currUser is accessed properly
    await Listing.findById(id);
    // Check for ownership
    if (!currUser || !listing.owner._id.equals(currUser._id)) {
        req.flash('error',"Permission denied, As you are not a host of this listing!"); // Use a specific key for flash message
        return res.redirect(`/listings/${id}`); // Return immediately to prevent further processing
    }
    next(); // Proceed to the next middleware or route handler if the user is the owner
};

//middleware to check authentication : is user is the owner of that listing
// module.exports.isOwner = async (req, res, next) => {
//     let { id } = req.params;
//     const listing = req.listing;  // Assuming listing is set in the request
//     const currUser = res.locals.currUser;  // Ensure currUser is accessed properly
    
//      await Listing.findById(id);
//     if (!currUser ||!listing.owner._id.equals(res.locals.currUser._id)) {
//         req.flash("error", "Permission denied, As you are not a host of this listing!");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// }