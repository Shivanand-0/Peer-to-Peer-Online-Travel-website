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
router.get("/",reviewController.redirectToReviewPage)
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// delete listing
router.get("/:reviewId",reviewController.redirectToReviewPage)
router.delete("/:reviewId",isLoggedIn,wrapAsync(reviewController.deleteReview))




module.exports=router;