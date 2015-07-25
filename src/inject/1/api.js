var api = {};

var posts;
var currentPostIndex;

function initApi() {
    posts = $(".post");
    currentPostIndex = -1;
    api.nextPost();
}

api.nextPost = function() {
    if (currentPostIndex + 1 > posts.size()) return;
    api.moveTo(++currentPostIndex);
};

api.prevPost = function() {
    if (currentPostIndex == -1) return;
    api.moveTo(--currentPostIndex);
};

api.moveTo = function(index) {
    var nextPostTop = posts.eq(index).offset().top;
    $("html, body").animate({scrollTop: (nextPostTop + "px")});
};

api.openProfile = function() {
    window.location = posts.eq(currentPostIndex).find(".post_title").prop("href");
};