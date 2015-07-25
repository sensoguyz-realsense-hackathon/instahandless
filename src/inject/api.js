var api = {};

var posts;
var currentPostIndex;

function initApi() {
    posts = $(".post_table");
    currentPostIndex = -1;
    api.nextPost();
    console.log(posts);
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

api.likeCurrentPost = function() {
    var likeElement = posts.eq(currentPostIndex).find(".post_like");

    if (!likeElement.find("i").hasClass("my_like")) {
        likeElement.click();
    }
};

api.dislikeCurrentPost = function() {
    var likeElement = posts.eq(currentPostIndex).find(".post_like");

    console.log(likeElement);

    if (likeElement.find("i").hasClass("my_like")) {
        likeElement.click();
    }
};

api.openProfile = function() {
    window.location = posts.eq(currentPostIndex).find(".author").prop("href");
};