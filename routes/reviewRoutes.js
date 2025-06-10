// require dependencies
const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing")
const Review=require("../models/review.js")
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,validateReview}=require("../middleware.js");




// 
//all reviews routes
// 
// create review
router.get("/",(req,resp)=>{
    resp.redirect(`/listings/${req.params.id}/details`)
})
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,resp)=>{
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
}))

// delete listing
router.get("/:reviewId",(req,resp)=>{
    resp.redirect(`/listings/${req.params.id}/details`)
})
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,resp)=>{
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
}))




module.exports=router;