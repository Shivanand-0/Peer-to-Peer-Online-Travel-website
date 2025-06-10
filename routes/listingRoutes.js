// require dependencies
const express=require("express");
const router=express.Router();
const Listing=require("../models/listing")
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {isLoggedIn,validateListing, isAutherized}=require("../middleware.js");




// 
// alll listing routes
// 
// home
router.get("/",wrapAsync(async(req,resp)=>{
    let allListing =await Listing.find({});
    if(!allListing){
        throw new ExpressError(500,"Listings does not exist.")
    }
    resp.render("./listings/index.ejs",{allListing})
}))
// Adding new listing(create operation)
router.get("/new",isLoggedIn,(req,resp)=>{
    resp.render("./listings/createListing.ejs")
})

router.post("/new",isLoggedIn,validateListing,wrapAsync(async(req,resp,next)=>{
    let newListingInfo=req.body;
    let userid=resp.locals.currUser._id
    let newListing=await Listing({...newListingInfo.listing});
    newListing.owner=userid
    let result=await newListing.save();
    console.log("listing addad")
    req.flash("success","New listing created.")
    resp.redirect("/listings")
}))
// Showing listing (read operation)
router.get("/:id/details",wrapAsync(async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id)
    .populate("owner")
    .populate({path:"reviews",populate:{path:"owner"}});
    if(!listingInfo){
        req.flash("error","Listing you requested for does not exist.")
        resp.redirect("/listings");
    }else{
        resp.render("./listings/showListing.ejs",{listing:listingInfo});
    }
    
}))

// edit listing (update operation)
router.get("/:id/edit",isLoggedIn,isAutherized,wrapAsync(async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    if(!listingInfo){
        req.flash("error","Listing you requested to edit does not exist.")
        resp.redirect("/listings");
    }
    else{
        resp.render("./listings/editListing.ejs",{listing:listingInfo});
    }

}))
router.put("/:id/edit",isAutherized,isLoggedIn,validateListing,wrapAsync(async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndUpdate(id,{$set:req.body.listing});
    req.flash("success","Listing updated.")
    console.log("listing updated successfully...");
    resp.redirect(`/listings/${id}/details`)
    
}))

//delete listing (delete operation)
router.get("/:id/delete",(req,resp)=>{
    resp.redirect(`/listings/${req.params.id}/details`)
});
router.delete("/:id/delete",isLoggedIn,isAutherized,wrapAsync(async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted.")
    resp.redirect("/listings")
}));



module.exports=router;