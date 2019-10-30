//Page elements
var $reviewsList = $("reviews");
var $scrapeBtn = $("#btn-scrape");
var $commentsList = $("#comments");
var $delCommentBtn = $(".btn-delete-comment");
var $addCommentBtn = $("#btn-comment-submit");

var API = {
    scrapeReviews: function() {
        return $.ajax({
            type: "GET",
            url: "/api/scrape"
        });
    },
    getReviews: function() {
        return $.ajax({
            url: "api/reviews",
            type: "GET"
        })
    },
    saveComment: function(id, comment) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "/api/reviews/" + id,
            data: JSON.stringify(comment)
        })
    },
    deleteComment: function(id) {
        return $.ajax({
            url: "/api/comments/" + id,
            type: "DELETE"
        });
    }
};

var handleScrape = function(event) {
    event.preventDefault();
    
    API.scrapeReviews().then(function() {
        API.getReviews().then(function() {
            location.reload();
        })
    });
}

var handleDeleteComment = function(event) {
    event.preventDefault();
    var idToDelete = $(this).attr("data-id");
    console.log("idToDelete: " + idToDelete);
    
    API.deleteComment(idToDelete).then(function() {
        location.reload();
    });
}

var handleAddComment = function(event) {
    event.preventDefault();
    alert("I've been clicked!");
}

$(document).on("click", "#btn-scrape", handleScrape);
$(document).on("click", ".btn-comment-delete", handleDeleteComment);
$(document).on("click", "#btn-comment-submit", handleAddComment);