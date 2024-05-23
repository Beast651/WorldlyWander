const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

// Index Route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  })
);

// New Route

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;

    // let dataAdd = await new Listing({
    //   title: title,
    //   description: description,
    //   image: image,
    //   price: price,
    //   location: location,
    //   country: country,
    // });

    const dataAdd = new Listing(req.body.listing);
    dataAdd.owner = req.user._id;
    await dataAdd.save();
    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
  })
);

// Edit Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editableContent = await Listing.findById(id);
    if (!editableContent) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { editableContent });
  })
);

// Delete Route

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let deletedProp = await Listing.findByIdAndDelete(id);
    console.log(deletedProp);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

// Show Route

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const details = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!details) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(details);
    res.render("listings/show.ejs", { details });
  })
);

// Update Route

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let { title, description, image, price, location, country } = req.body;
    // let updatedDesc = await Listing.findByIdAndUpdate(
    //   id,
    //   {
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     location: location,
    //     country: country,
    //   },
    //   { runValidators: true, new: true }
    // );
    // console.log(updatedDesc);

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
