var api = {};

var posts = $(".-cx-PRIVATE-FeedPage__post");
var currentPostIndex = -1;

api.nextPost = function() {
    api.moveTo(++currentPostIndex);
};

api.prevPost = function() {
    api.moveTo(--currentPostIndex);
};

api.moveTo = function(index) {
    var nextPostTop = posts.eq(index).offset().top;
    $("html, body").animate({scrollTop: (nextPostTop + "px")});
};

api.likeCurrentPost = function() {
    posts.eq(currentPostIndex).find(".-cx-PRIVATE-PostInfo__likeButton").click();
};

api.openProfile = function() {
    window.location = posts.eq(currentPostIndex).find(".-cx-PRIVATE-Post__ownerUserLink").prop("href");
};