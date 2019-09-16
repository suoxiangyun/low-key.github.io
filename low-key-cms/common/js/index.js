javaex.lazyload({
    selector : "img"
});

javaex.slide({
    id : "slide",
    delay : 3000
});

// 鑾峰彇浠婃棩鏃ユ湡
var today = javaex.getTime("today");

// 鑾峰彇浠婂ぉ鏄懆鍑�
var week = javaex.getTime("week");
javaex.tab({
    id : "tab1",
    current : week,
    mode : "click"
});

javaex.tab({
    id : "tab2",
    current : 1,
    mode : "click"
});

$(window).scroll(function() {
    var sc = $(window).scrollTop();
    if (sc<300) {
        $(".header-wrap").css("background", "linear-gradient(#1a1a1a,transparent)");
    } else {
        $(".header-wrap").css("background", "#1a1a1a");
    }
});
javaex.popin();