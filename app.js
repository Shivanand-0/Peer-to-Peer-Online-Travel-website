// require dependencies
const express=require("express");
const ejs=require("ejs");
const path=require("path")
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Listing=require("./models/listing")
const ejsMate=require("ejs-mate")
const methodOverride = require('method-override')




// app set and use and config
const app=express();
app.engine("ejs",ejsMate)
app.set("view engine","ejs")
app.set("viwes", path.join(__dirname,"./views"))
app.use(express.static(path.join(__dirname,"./public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// access .env data
dotenv.config();
const MONGO_URL=process.env.MONGO_URL;

//connecting to database
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{console.log("connect database...")})
.catch((e)=>{console.log("db connection error: ",e)})

// routes
// home
app.get("/",(req,resp)=>{
    resp.redirect("/listings")
})

app.get("/listings",async(req,resp)=>{
    let allListing =await Listing.find({})
    resp.render("./listings/index.ejs",{allListing})
})
// Adding new listing(create operation)
app.get("/listings/new",(req,resp)=>{
    resp.render("./listings/createListing.ejs")
})

app.post("/listings/new",async(req,resp)=>{
    let newListingInfo=req.body;
    let newListing=await Listing({...newListingInfo.listing});
    await newListing.save();
    resp.redirect("/listings")
})
// Showing listing (read operation)
app.get("/listings/:id/details",async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    resp.render("./listings/showListing.ejs",{listing:listingInfo});
})

// edit listing (update operation)
app.get("/listings/:id/edit",async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    resp.render("./listings/editListing.ejs",{listing:listingInfo});

})
app.put("/listings/:id/edit",async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndUpdate(id,{$set:req.body.listing});
    console.log("listing updated successfully...");
    resp.redirect(`/listings/${id}/details`)
})

//delete listing (delete operation)
app.delete("/listings/:id/delete",async(req,resp)=>{
    await Listing.findByIdAndDelete(req.params.id);
    resp.redirect("/listings")
})



// starting server
app.listen(3000,()=>{
    console.log("server started at 3000")
})