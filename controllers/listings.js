const Listing=require("../models/listing")
const ExpressError=require("../utils/ExpressError.js")
const {cloudinary}=require("../cloudConfig.js")




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
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=await Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    await newListing.save();
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
        let originalImgUrl=listingInfo.image.url;
        originalImgUrl=originalImgUrl.replace("/upload","/upload/w_250")
        resp.render("./listings/editListing.ejs",{listing:listingInfo,originalImgUrl});
    }

}

module.exports.updateListing=async(req,resp)=>{
    let id=req.params.id;
    let listing=await Listing.findByIdAndUpdate(id,{$set:req.body.listing});
    if(typeof req.file !=="undefined"){
        // delete prev img
        try {
            if (listing.image && listing.image.filename) {
                const result = await cloudinary.uploader.destroy(listing.image.filename);
                console.log("Cloudinary delete result:", result);
            } else {
                console.log("No image filename found to delete");
            }
        } catch(e){
            console.log("cloud img delete error:", e);
        }
        // upload new img
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url:url,filename:filename};
        await listing.save();
    }

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
    let listing=await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    try {
        if (listing.image && listing.image.filename) {
            const result = await cloudinary.uploader.destroy(listing.image.filename);
            console.log("Cloudinary delete result:", result);
        } else {
            console.log("No image filename found to delete");
        }
    } catch (e) {
        console.log("cloud img delete error:", e);
    }
    req.flash("success","Listing deleted.")
    resp.redirect("/listings")
}