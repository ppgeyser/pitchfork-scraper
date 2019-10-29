// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

module.exports = function (app) {
    // A GET route for scraping pitchfork website
    app.get("/api/scrape", function (req, res) {

        //Grab html body using axios
        axios.get("https://pitchfork.com/reviews/albums/?page=1").then(function (response) {

            //Data saved to cheerio and saved to $ as a shortcut
            var $ = cheerio.load(response.data);

            //Grab all <a> tags
            $("div[class=review] a").each(function (i, element) {

                // Save an empty result object
                var result = {};

                //Add Album name, Artist, ImageURL, and href and save them as properties of results object
                result.artist = $(this)
                    .children("div.review__title")
                    .children("ul")
                    .children("li")
                    .text();
                result.album = $(this)
                    .children("div.review__title")
                    .children("h2")
                    .text();
                result.img = $(this)
                    .children("div.review__artwork")
                    .children("div")
                    .children("img")
                    .attr("src")
                result.link = ("https://pitchfork.com" + $(this)
                    .attr("href"))

                //Create new review in db using result object
                db.Review.create(result)
                    .then(function (dbReview) {
                        // View the added result in the console
                        console.log(dbReview);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });

            });

            // Send a message to the client
            res.send("Scrape Complete");

        });
    });

    // Route for grabbing a specific Review by id, populate it with it's comments
    app.get("/api/reviews/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Review.findOne({
                _id: req.params.id
            })
            // ..and populate all of the comments associated with it
            .populate("comment")
            .then(function (dbReview) {
                // If we were able to successfully find an Review with the given id, send it back to the client
                res.json(dbReview);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for getting all reviews from the db
    app.get("/api/reviews", function (req, res) {
        // Grab every document in the Reviews collection
        db.Review.find({})
            .then(function (dbReview) {
                // If we were able to successfully find Reviews, send them back to the client
                res.json(dbReview);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating a Review's associated Comment
    app.post("/api/review/:id", function (req, res) {
        // Create a new comment and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                // If a Comment was created successfully, find one Review with an `_id` equal to `req.params.id`. Update the Review to be associated with the new Comment
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Review.findOneAndUpdate({
                    _id: req.params.id
                },
                { $push: 
                    {
                        comment: dbComment._id
                    }
                },
                { new: true }
                );
            })
            .then(function (dbReview) {
                // If we were able to successfully update an Review, send it back to the client
                res.json(dbReview);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Delete a comment by id
    app.delete("api/comments/:id", function (req, res) {
        db.Comment.findByIdAndDelete(req.params.id).then(function (dbComment) {
            res.json(dbComment);
        })
    })

}