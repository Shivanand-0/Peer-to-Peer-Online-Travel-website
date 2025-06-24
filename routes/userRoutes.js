// require dependencies
const express=require("express");
const router=express.Router();
const passport=require("passport")
const wrapAsync=require("../utils/wrapAsync.js");
const {redirectPath}=require("../middleware.js");
const userController=require("../controllers/user.js")




// ////local stratigies
// signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// login
router.route("/login")
.get(userController.renderLoginForm)
.post(
    redirectPath,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash: true }),
   userController.login
)

// logout
router.get("/logout", userController.logout);


// //// passport-google-oauth20
// Redirect user to Google for authentication
router.get(
    "/auth/google",
    passport.authenticate("google",{scope:['profile', 'email']}),
)
//  Handle the callback from Google
router.get('/auth/google/callback',
    redirectPath,
    passport.authenticate('google',{failureRedirect: '/login'}),
    userController.login
);


module.exports=router