// require dependencies
const express=require("express");
const ejs=require("ejs");
const path=require("path")
const ejsMate=require("ejs-mate")
const methodOverride = require('method-override')
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const listingRoutes=require("./routes/listingRoutes.js")
const reviewRoutes=require("./routes/reviewRoutes.js")
const session=require("express-session");
const flash=require("connect-flash")





// access .env data
dotenv.config();
const MONGO_URL=process.env.MONGO_URL;
const SESSION_SECRET=process.env.SESSION_SECRET;

// initialization
SESSION_OPTION={
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        maxAge:7*24*60*60*1000,
        expires:Date.now()+7*24*60*60*1000
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
// session related
app.use(session(SESSION_OPTION));
app.use(flash());
// middleware to store data in locals
app.use((req,resp,next)=>{
    resp.locals.success=req.flash("success");
    resp.locals.error=req.flash("error");
    next();
})



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
    resp.redirect("/listings");
})
// listing routes
app.use("/listings",listingRoutes);
// review routes
app.use("/listings/:id/details/reviews",reviewRoutes);


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