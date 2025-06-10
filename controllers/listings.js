const Listing=require("../models/listing")
const ExpressError=require("../utils/ExpressError.js")





// index route controller
module.exports.index=async(req,resp)=>{
    let allListing =await Listing.find({});
    if(!allListing){
        throw new ExpressError(500,"Listings does not exist.")
    }
    resp.render("./listings/index.ejs",{allListing})
}

// create listing controller
module.exports.renderNewListingForm=(req,resp)=>{
    resp.render("./listings/createListing.ejs")
}


module.exports.newListing=async(req,resp,next)=>{
    let newListingInfo=req.body;
    let userid=resp.locals.currUser._id
    let newListing=await Listing({...newListingInfo.listing});
    newListing.owner=userid
    let result=await newListing.save();
    console.log("listing addad")
    req.flash("success","New listing created.")
    resp.redirect("/listings")
}

// show listing
module.exports.showListing=async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id)
    .populate("owner")
    .populate({path:"reviews",populate:{path:"owner"}});
    if(!listingInfo){
        req.flash("error","Listing you requested for does not exist.")
        resp.redirect("/listings");
    }else{
        resp.render("./listings/showListing.ejs",{listing:listingInfo});
    }
}

// edit listing (update operation)
module.exports.editListingForm=async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    if(!listingInfo){
        req.flash("error","Listing you requested to edit does not exist.")
        resp.redirect("/listings");
    }
    else{
        resp.render("./listings/editListing.ejs",{listing:listingInfo});
    }

}

module.exports.updateListing=async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndUpdate(id,{$set:req.body.listing});
    req.flash("success","Listing updated.")
    console.log("listing updated successfully...");
    resp.redirect(`/listings/${id}/details`)
}

//delete listing (delete operation)
module.exports.redirectToDelete=(req,resp)=>{
    resp.redirect(`/listings/${req.params.id}/details`)

}

module.exports.deleteListing=async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted.")
    resp.redirect("/listings")
}