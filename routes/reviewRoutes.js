// require dependencies
const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,validateReview}=require("../middleware.js");
const reviewController=require("../controllers/review.js")



// 
//all reviews routes
// 
// create review
router.route("/")
.get(reviewController.redirectToReviewPage)
.post(isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete listing
router.route("/:reviewId")
.get(reviewController.redirectToReviewPage)
.delete(isLoggedIn,wrapAsync(reviewController.deleteReview))




module.exports=router;