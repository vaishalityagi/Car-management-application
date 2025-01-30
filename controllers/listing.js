const Listing = require ("../models/listing.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs" , {allListings});
};

module.exports.search = async(req,res)=>{
     // Get the search query from the request (e.g., ?search=query)
     let searchQuery = req.query.query ;  // Default to empty string if no search is provided!
console.log(searchQuery);
     if(!searchQuery){
        return res.redirect("/listings");
     }

     // Use the search query to filter the listings, assuming you want to search by title or name
     const allListings = await Listing.find({
         title: { $regex: searchQuery, $options: 'i' } // Case-insensitive search
     });

     if(allListings.length === 1){
        return res.redirect(`/listings/${allListings[0]._id}`);
     }
 
     // Log the filtered listings to the console
     console.log(allListings);
     res.render('listings/search.ejs', { searchQuery ,allListings });
};

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");

};

module.exports.showListing =async(req,res)=>{
    let {id } = req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate:{path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

// module.exports.createListing=async(req,res,next)=>{
//     let url = req.file.path;
//     let filename =  req.file.filename;
//     console.log(url,'...', filename);
    
//     const newListing = new Listing (req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image ={url,filename};
//      console.log(newListing);
    
//     await newListing.save();
//     req.flash("success","New listing created");
//     res.redirect("/listings");

// };

module.exports.createListing=async(req,res,next)=>{
    console.log(req.files); // Logs uploaded images

    if (!req.files || req.files.length === 0) {
        throw new Error("No images uploaded");
    };

    // Map uploaded files into { url, filename } format
    const imageFiles = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    // let url = req.file.path;
    // let filename =  req.file.filename;
    // console.log(url,'...', filename);
    
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    newListing.image =imageFiles;
     console.log(newListing);
    
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");

};


module.exports.renderEditForm =async(req,res)=>{
    let {id } = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");

    }
    res.render("listings/edit.ejs",{listing});

};

module.exports.updateListing =async(req,res)=>{
    let {id}= req.params;
    
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename =  req.file.filename;
    listing.image ={url,filename};
    await listing.save();
}
   
    req.flash("success"," Listing Updated!");

    res.redirect(`/listings/${id}`);


};

module.exports.deleteListing =async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted!");

    res.redirect("/listings");

}
