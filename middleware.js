const Listing=require("./models/listing")
const {validListingSchema, validReviewSchema}=require("./Schema")
const ExpressError=require("./utils/ExpressError.js")




// database listing Schema validation middelware (Server side validation)
module.exports.validateListing=(req,resp,next)=>{
    let {error}=validListingSchema.validate(req.body.listing);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next();
    }
}

// database review Schema validation middelware (Server side validation)
module.exports.validateReview=(req,resp,next)=>{
    let {error}=validReviewSchema.validate(req.body.review);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next();
    }

}

// authentication middleware
module.exports.isLoggedIn=(req,resp,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectPath=req.originalUrl
        req.flash("error","You must be logged in.");
        return resp.redirect("/login")
    }
    next()
}

module.exports.redirectPath=(req,resp,next)=>{
    if(req.session.redirectPath){
        resp.locals.redirectPath=req.session.redirectPath;
    }
    next()
}
// middleware for authorizatin
module.exports.isAutherized=async(req,resp,next)=>{
    let id=req.params.id;
    let listinginfo=await Listing.findById(id);
    if(! listinginfo.owner.equals(resp.locals.currUser._id)){
        req.flash("error","You don't have permission!!!")
        return resp.redirect(`/listings/${id}/details`)
    }
    next()
}

// middleware for map geocoding
// for handling unwanted img saving on cloud before location varification

// module.exports.isLocationCorrect=async(req,resp,next)=>{
//     console.log(req)
//     console.log("in mw")
//     const urlMap = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
//   try {
//     console.log("in try")
//     const response = await fetch(
//       urlMap,
//        {
//       headers: {
//         'User-Agent': 'TripHut/1.0 (your.email@example.com)' // polite usage
//       }
//       }
//     );
//     const data = await response.json();
//     if (data.length > 0) {
//         resp.locals.coordiate = [data[0].lat, data[0].lon];
//         next()
//     } else {
//       req.flash("error", "Please enter accurate location");
//       return resp.redirect("/listings/new");
//     }
//   }catch (err) {
//     console.error("Geocoding error:", err);
//     req.flash("error", "Error occured!!! Please try again after some time latter.");
//     return resp.redirect("./listings/createListing.ejs");
//   }
// }
