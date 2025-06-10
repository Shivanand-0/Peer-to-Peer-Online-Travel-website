// require dependencies
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,validateListing, isAutherized}=require("../middleware.js");
const listingContoller=require("../controllers/listings.js")



// 
// alll listing routes
// 
// index
router.get("/",wrapAsync(listingContoller.index))
// Adding new listing(create operation)
router.get("/new",isLoggedIn,listingContoller.renderNewListingForm)

router.post("/new",isLoggedIn,validateListing,wrapAsync(listingContoller.newListing))
// Showing listing (read operation)
router.get("/:id/details",wrapAsync(listingContoller.showListing))

// edit listing (update operation)
router.get("/:id/edit",isLoggedIn,isAutherized,wrapAsync(listingContoller.editListingForm))
router.put("/:id/edit",isAutherized,isLoggedIn,validateListing,wrapAsync(listingContoller.updateListing))

//delete listing (delete operation)
router.get("/:id/delete",listingContoller.redirectToDelete);
router.delete("/:id/delete",isLoggedIn,isAutherized,wrapAsync(listingContoller.deleteListing));



module.exports=router;