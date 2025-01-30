const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");

};
module.exports.signUp =async(req,res)=>{
    try{

     let {username,email,password} = req.body;
    const newUser = new User ({username, email});
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Cars portal!");
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    

};
module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =(req,res)=>{
    req.flash("success","Welcome back to Car Management Application! You are logged in!");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you out!");
     res.redirect("/listings");
       
    });
    
}