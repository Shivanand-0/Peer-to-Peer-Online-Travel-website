const Listing=require("../models/listing")
const Review=require("../models/review")


// create review controller
module.exports.redirectToReviewPage=(req,resp)=>{
    resp.redirect(`/listings/${req.params.id}/details`)
}

module.exports.createReview=async(req,resp)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    let reviewData={...req.body.review,owner:resp.locals.currUser}
    let newReview= new Review(reviewData);
    listing.reviews.push(newReview);    
    listing.save();
    newReview.save();
    req.flash("success","Review saved.")
    console.log("review saved..");
    resp.redirect(`/listings/${req.params.id}/details`)
}


// delete review contoller 
module.exports.deleteReview=async(req,resp)=>{
    let {id,reviewId}=req.params;
    let reviewInfo=await Review.findById(reviewId);
    if(! reviewInfo.owner.equals(resp.locals.currUser._id)){
        req.flash("error","You don't have permission!!!")
        return resp.redirect(`/listings/${id}/details`);
    }
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted.")
    console.log("review deleted..");
    resp.redirect(`/listings/${id}/details`);
}