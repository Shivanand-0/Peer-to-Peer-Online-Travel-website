const Listing=require("../models/listing")
const ExpressError=require("../utils/ExpressError.js")
const {cloudinary}=require("../cloudConfig.js");
const { all } = require("../routes/listingRoutes.js");



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


module.exports.newListing = async (req, resp, next) => {
  const urlMap = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
  try {
    const response = await fetch(
      urlMap,
       {
      headers: {
        'User-Agent': 'TripHut/1.0 (your.email@example.com)' // polite usage
      }
      }
    );
    const data = await response.json();
    if (data.length > 0) {
      let coordiate = [data[0].lat, data[0].lon];
      let url = req.file.path;
      let filename = req.file.filename;
      let newListing = await Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = { url, filename };
      newListing.coordinate = coordiate;
      await newListing.save();
      console.log("listing addad");
      console.log(coordiate);
      req.flash("success", "New listing created.");
      resp.redirect("/listings");
    } else {
      console.log("No results found.");
      req.flash("error", "Please enter accurate location");
      resp.redirect("/listings/new");
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    req.flash("error", "Error occured!!! Please try again after some time latter.");
    resp.redirect("./listings/createListing.ejs");
  }
};

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

// search controller
module.exports.search=async(req,resp)=>{
    let location=req.query.search;
    try{
    let allListing= await Listing.find({location:{$regex:location}})  
    if(Array.isArray(allListing) && allListing.length==0){
        req.flash("error","No listing availible at this location.")
        return resp.redirect("/listings")
    }
    resp.render("./listings/index.ejs",{allListing})
    }catch(e){
        console.log("Search error: ",e)
        req.flash("error","'Error performing search'.")
        return resp.redirect("/listings")
    }

}