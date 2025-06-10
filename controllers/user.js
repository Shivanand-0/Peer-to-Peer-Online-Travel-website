const User=require("../models/user")


// signup controller
module.exports.renderSignupForm=(req,resp)=>{
    resp.render("./user/signup.ejs")
}

module.exports.signup=async(req,resp,next)=>{
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
}

// login contoller
module.exports.renderLoginForm=(req,resp)=>{
    resp.render("./user/login.ejs")
}
module.exports.login= async(req,resp)=>{
        let {username}=req.user;
        req.flash("success",`welcome, ${username}`)  //req.body.username
        let redirectedUrl=resp.locals.redirectPath||"/listings";
        console.log("login success...")
        resp.redirect(redirectedUrl)
    }

    // logout contoller
module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out now.");
        res.redirect("/listings");
    });
}