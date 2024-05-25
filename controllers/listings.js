const Listing = require("../model/listing");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  // let { title, description, image, price, location, country } = req.body;

  // let dataAdd = await new Listing({
  //   title: title,
  //   description: description,
  //   image: image,
  //   price: price,
  //   location: location,
  //   country: country,
  // });
  let url = req.file.path;
  let filename = req.file.filename;

  const dataAdd = new Listing(req.body.listing);
  dataAdd.owner = req.user._id;
  dataAdd.image = { url, filename };
  await dataAdd.save();
  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let editableContent = await Listing.findById(id);
  if (!editableContent) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { editableContent });
};

module.exports.destroyListings = async (req, res) => {
  let { id } = req.params;

  let deletedProp = await Listing.findByIdAndDelete(id);
  console.log(deletedProp);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.showListings = async (req, res) => {
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
};

module.exports.updateListings = async (req, res) => {
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
};
