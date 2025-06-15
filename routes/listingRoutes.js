// require dependencies
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,validateListing, isAutherized}=require("../middleware.js");
const listingContoller=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })


// 
// alll listing routes
// 
// index
router.get("/",wrapAsync(listingContoller.index));
// Adding new listing(create operation)
router.route("/new")
.get(isLoggedIn,listingContoller.renderNewListingForm)
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingContoller.newListing));

// Showing listing (read operation)
router.get("/:id/details",wrapAsync(listingContoller.showListing));

// edit listing (update operation)
router.route("/:id/edit")
.get(isLoggedIn,isAutherized,wrapAsync(listingContoller.editListingForm))
.put(isAutherized,isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingContoller.updateListing));

//delete listing (delete operation)
router.route("/:id/delete")
.get(listingContoller.redirectToDelete)
.delete(isLoggedIn,isAutherized,wrapAsync(listingContoller.deleteListing));

// search
router.get("/search",wrapAsync(listingContoller.search))

module.exports=router;