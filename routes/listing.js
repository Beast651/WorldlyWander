const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../model/listing");

// Server Side Error Handling for Listings

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  })
);

// New Route

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route

router.post(
  "/",
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

    await dataAdd.save();
    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
  })
);

// Edit Route

router.get(
  "/:id/edit",
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
    const details = await Listing.findById(id).populate("reviews");
    if (!details) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { details });
  })
);

// Update Route

router.put(
  "/:id",
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
