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
    getComments: function(id) {
        return $.ajax({
            type: "GET",
            url: "/api/reviews/" + id
        })
    },
    saveComment: function(comment) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/reviews/:id",
            data: JSON.stringify(comment)
        })
    },
    deleteComment: function(id) {
        return $.ajax({
            url: "/api/comments/" + id,
            type: "DELETE"
        })
    }
}