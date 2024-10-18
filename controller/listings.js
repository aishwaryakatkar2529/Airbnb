const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
 };

 module.exports.newForm = (req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create a listing");
    //     return res.redirect("/login");
    // }
    // console.log(req.user);
     res.render("listings/new.ejs");
 };

 module.exports.showListing = async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate:{
            path : "author",
        },
    })
    .populate("owner");

//   console.log(listing);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect(`/listings`); // Add return to prevent further execution
    }
    // console.log(listing);

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async(req,res, next)=>{
   let response =  await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1,
      })
        .send();

        // console.log(response.body.features[0].geometry);
        // res.send("done!");
        
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
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url , "..." , filename);
        const newListing = new Listing(req.body.listing);
        // if(!newListing.description){
        //     throw new ExpressError(400,"Description needs");
        // }

        // console.log(req.user);
        // who is the owner of new listing is stored in newListing.owner
        newListing.owner = req.user._id; //owners id 
        newListing.image = {url , filename};

        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        // console.log(savedListing);
        req.flash("success" , "New Listing Created successfully!!");
        // console.log(newListing);
        res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); // Add return to prevent further execution
    }

    let originalImageUrl = listing.image.url;
   originalImageUrl =  originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listings/edit.ejs", { listing , originalImageUrl });
};

module.exports.updateListing = async(req,res) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for Listing");
    // }
    let {id} = req.params;

    // let listing =  await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","you don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success" ,"Listing Updated Successfully!");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log(deleteListing);
    req.flash("success" ,"Listing Deleted Successfully!");
    res.redirect("/listings");

};