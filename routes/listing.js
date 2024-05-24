const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

// Index and Create Route

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update and Delete Route

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListings)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

// Edit Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
