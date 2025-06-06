// require dependencies
const express=require("express");
const ejs=require("ejs");
const path=require("path")
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Listing=require("./models/listing")
const ejsMate=require("ejs-mate")
const methodOverride = require('method-override')
const {validListingSchema}=require("./Schema.js")
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")

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

app.get("/listings",wrapAsync(async(req,resp)=>{
    let allListing =await Listing.find({})
    resp.render("./listings/index.ejs",{allListing})
}))
// Adding new listing(create operation)
app.get("/listings/new",(req,resp)=>{
    resp.render("./listings/createListing.ejs")
})

app.post("/listings/new",validateListing,wrapAsync(async(req,resp,next)=>{
    let newListingInfo=req.body;
    let newListing=await Listing({...newListingInfo.listing});
    await newListing.save();
    resp.redirect("/listings")
}))
// Showing listing (read operation)
app.get("/listings/:id/details",wrapAsync(async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    resp.render("./listings/showListing.ejs",{listing:listingInfo});
}))

// edit listing (update operation)
app.get("/listings/:id/edit",wrapAsync(async(req,resp)=>{
    let listingInfo=await Listing.findById(req.params.id);
    resp.render("./listings/editListing.ejs",{listing:listingInfo});

}))
app.put("/listings/:id/edit",validateListing,wrapAsync(async(req,resp)=>{
    let id=req.params.id;
    await Listing.findByIdAndUpdate(id,{$set:req.body.listing});
    console.log("listing updated successfully...");
    resp.redirect(`/listings/${id}/details`)
}))

//delete listing (delete operation)
app.delete("/listings/:id/delete",wrapAsync(async(req,resp)=>{
    await Listing.findByIdAndDelete(req.params.id);
    resp.redirect("/listings")
}))

// wildcard route
app.all("/{*any}",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
});

app.use((err,req,resp,next)=>{
    // resp.send(err)
    let {statusCode=500,message="Something went wrong!!!"}=err
    resp.status(statusCode).render("./Error.ejs",{errorMsg:message})
})


// starting server
app.listen(3000,()=>{
    console.log("server started at: 3000")
})