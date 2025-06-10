// require dependencies
const express=require("express");
const router=express.Router();
const passport=require("passport")
const wrapAsync=require("../utils/wrapAsync.js");
const {redirectPath}=require("../middleware.js");
const userController=require("../controllers/user.js")





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

module.exports=router