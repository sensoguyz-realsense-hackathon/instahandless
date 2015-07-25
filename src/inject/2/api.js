var api = {};

var post;

function initApi() {
    post = $(".post");
    var nextPostTop = post.offset().top;
    $("html, body").animate({scrollTop: (nextPostTop + "px")});
}

api.scrollDown = function() {
    var nextScrollPos = $(document).scrollTop() + 500;
    $("html, body").animate({scrollTop: (nextScrollPos + "px")})
};

api.scrollUp = function() {
    if ($(document).scrollTop() < 0) return;
    var nextScrollPos = $(document).scrollTop() - 500;
    $("html, body").animate({scrollTop: (nextScrollPos + "px")})
};