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

