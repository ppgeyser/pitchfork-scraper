var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Review.find({}).
    then(function(dbReview) {
      res.render("index", {
        reviews: dbReview,
      });
    });
  });

  // Load individual review with comments page
  app.get("/reviews/:id", function(req, res) {
    db.Review.findOne({
      _id: req.params.id
  })
  .populate("comment")
    .then(function(dbReview) {
      res.render("comments", {
        review: dbReview,
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};




