const express = require("express");
const router =  express.Router();
const wrapAsync =  require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpreesError.js");
const Listing = require ("../models/listing.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn, isOwner,validateListing} =  require("../middleware.js");
const listingController =  require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const { upload } = require("../cloudConfig.js");

// const upload = multer({ storage });


//Index ROUTE
router.get("/",wrapAsync(listingController.index));

router.get("/search",wrapAsync(listingController.search));


//New Route
router.get("/new" , isLoggedIn, listingController.renderNewForm);

//SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));


//Create route
router.post("/" , isLoggedIn, upload, validateListing,wrapAsync(listingController.createListing));

// router.post('/',upload.single('listing[image]'),(req,res) =>{
//  upload.single('listing[image]')   res.send(req.file);
// });

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm));

//Update route
router.put("/:id", isLoggedIn ,isOwner,upload ,validateListing,wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;