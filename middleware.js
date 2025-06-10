module.exports.isLoggedIn=(req,resp,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectPath=req.originalUrl
        req.flash("error","You must be logged in.");
        return resp.redirect("/login")
    }
    next()
}

module.exports.redirectPath=(req,resp,next)=>{
    if(req.session.redirectPath){
        resp.locals.redirectPath=req.session.redirectPath;
    }
    next()
}