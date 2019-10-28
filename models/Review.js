var mongoose = require("mongoose");

// Save a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    // artist name is required and of type String
    artist: {
      type: String,
      required: true
    },
    // album name is requred and of type String
    album: {
        type: String,
        required: true
    },
    // img (for album art) is requred and of type String
    img: {
        type: String,
        required: true
    },
    // link to review is required and of type String
    link: {
      type: String,
      required: true,
      // This ensures that we do not scrape and save duplicates
      unique: true
    },
    // This allows us to populate the Review with an associated Note
    comment: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
    
  });
  
  // This creates our model from the above schema, using mongoose's model method
  var Review = mongoose.model("Review", ReviewSchema);
  
  // Export the Review model
  module.exports = Review;
  