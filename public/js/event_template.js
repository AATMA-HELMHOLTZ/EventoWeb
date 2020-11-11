

$('body').scrollspy({ target: '#navbar-example3' })

$(function () {
    $(document).scroll(function () {
        var $nav = $("#mainNavbar");
        $nav.toggleClass("scroll", $(this).scrollTop() > $nav.height());
    });
});
