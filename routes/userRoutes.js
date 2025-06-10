// require dependencies
const express=require("express");
const router=express.Router();
const User=require("../models/user")
const passport=require("passport")
const wrapAsync=require("../utils/wrapAsync.js");
const {redirectPath}=require("../middleware.js");






// signup

router.get("/signup",(req,resp)=>{
    resp.render("./user/signup.ejs")
})


router.post("/signup",wrapAsync(async(req,resp,next)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=await new User({username:username,email:email});
        let result=await User.register(newUser,password);
        req.login(result,(err)=>{
            if(err){return next(err)}
            req.flash("success",`welcome, ${result.username}`);
            resp.redirect("/listings")
        })
        
    }catch(err){
        req.flash("error",err.message);
        resp.redirect("/signup")
    }
}))

// login

router.get("/login",(req,resp)=>{
    resp.render("./user/login.ejs")
})

router.post(
    "/login",
    redirectPath,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash: true }),
    async(req,resp)=>{
        let {username}=req.user;
        req.flash("success",`welcome, ${username}`)  //req.body.username
        let redirectedUrl=resp.locals.redirectPath||"/listings";
        console.log(redirectedUrl)
        resp.redirect(redirectedUrl)
    }
)


// logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out now.");
        res.redirect("/listings");
    });
});


router.get("/logout", (req,resp,next)=>{
    req.flash("success",`welcome,`)  //req.body.username

    req.logout((err)=>{
        if(err){
            return next(err)
        }
    })

    resp.redirect("/listings")
})

module.exports=router