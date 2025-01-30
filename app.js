
if(process.env.NODE_ENV != "production"){
    const dotenv = require('dotenv').config();
}
// console.log(process.env.SECRET); 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require ("./models/listing.js");
// const Review = require ("./models/review.js");

const path = require("path");
const methodOverride =  require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync =  require("./utils/wrapAsync.js");
const ExpressError =  require("./utils/ExpreesError.js");
// const { listingSchema ,reviewSchema} = require("./schema.js");
// const review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");



// const ejs = require("ejs");


// main().catch(err => console.log(err));
const dbUrl = process.env.ATLASDB_URL;
// const MONGO_URL = "mongodb://127.0.0.1:27017/cars";

app.engine('ejs', ejsMate);
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
  };
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); //to parse the request data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));




app.listen(8080,()=>{
    console.log("listening on port 8080");
});

// app.get("/testListing",async(req,res)=>{
//      let sampleListing =  new Listing({
//         title:"My New villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"INDIA",
//      });
//      await sampleListing.save();
//      console.log("sample was save");
//      res.send("successful testing");
// });
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter: 24*3600,


});
store.on("error", ()=>{
    console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store:store,
    secret :process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly:true,


    },
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success =  req.flash("success");
    // console.log(res.locals);
    res.locals.error =  req.flash("error");
    // console.log(req.user);
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser", async(req,res) =>{
//     let fakeUser =  new User({
//         email:"student@gmail.com",
//         username:"delta_student",
    
//     });

//     let registeredUser =  await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// });

app.use("/listings", listingsRouter);

app.use('/listings/:id/reviews', reviewsRouter);

app.use("/", userRouter);

// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// });


app.all("*", (req,res,next) =>{
    next(new ExpressError(404 ,"Page not found!"));

});

//Error handling middelware
app.use((err,req,res,next) =>{
    let {statusCode =500,  message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
    // res.send("something went wrong!");
});