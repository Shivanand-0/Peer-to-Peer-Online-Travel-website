// require dependencies
const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing")
const Review=require("../models/review.js")
const {validReviewSchema}=require("../Schema.js")
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {isLoggedIn}=require("../middleware.js");


// database Schema validation middelware (Server side validation)
const validateReview=(req,resp,next)=>{
    let {error}=validReviewSchema.validate(req.body.review);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next();
    }

}

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
    let newReview= new Review(req.body.review);
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
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted.")
    console.log("review deleted..");
    resp.redirect(`/listings/${id}/details`);
}))




module.exports=router;