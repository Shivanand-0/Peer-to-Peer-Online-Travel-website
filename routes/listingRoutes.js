// require dependencies
const express=require("express");
const router=express.Router();
const Listing=require("../models/listing")
const Review=require("../models/review.js")
const {validListingSchema}=require("../Schema.js")
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")


// database Schema validation middelware (Server side validation)
const validateListing=(req,resp,next)=>{
    let {error}=validListingSchema.validate(req.body.listing);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next();
    }
}


// 
// alll listing routes
// 
// home
router.get("/",wrapAsync(async(req,resp)=>{
    let allListing =await Listing.find({})
    resp.render("./listings/index.ejs",{allListing})
}))
// Adding new listing(create operation)
router.get("/new",(req,resp)=>{
    resp.render("./listings/createListing.ejs")
})

router.post("/new",validateListing,wrapAsync(async(req,resp,next)=>{
    let newListingInfo=req.body;
    let newListing=await Listing({...newListingInfo.listing});
    await newListing.save();
    resp.redirect("/listings")
}))
// Showing listing (read operation)
router.get("/:id/details",wrapAsync(async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id).populate("reviews");
    resp.render("./listings/showListing.ejs",{listing:listingInfo});
}))

// edit listing (update operation)
router.get("/:id/edit",wrapAsync(async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    resp.render("./listings/editListing.ejs",{listing:listingInfo});

}))
router.put("/:id/edit",validateListing,wrapAsync(async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndUpdate(id,{$set:req.body.listing});
    console.log("listing updated successfully...");
    resp.redirect(`/listings/${id}/details`)
}))

//delete listing (delete operation)
router.delete("/:id/delete",wrapAsync(async(req,resp)=>{
    let id=req.params.id;
    let listingInfo=await Listing.findById(id);
    let reviewList=listingInfo.reviews;
    console.log(reviewList)
    await Review.deleteMany({_id:{$in:reviewList}})
    await Listing.findByIdAndDelete(id);
    resp.redirect("/listings")
}))



module.exports=router;