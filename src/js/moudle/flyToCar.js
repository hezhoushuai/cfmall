define(['jquery', "fly"], function ($, fly) {
    return function ( e, endSelector, imgs, msg) { 
        var img = $(imgs).attr('src');
        var flyer = $('<img class="u-flyer" src="' + img + '">');
        flyer.fly({
            start: {
                left: e.clientX,
                top: e.clientY
            },
            end: {
                left: $(window).innerWidth() - 68,
                top: $(endSelector).position().top,
                width: 0,
                height: 0
            },
            onEnd: function () {
                $(msg).show().animate({
                    width: '250px'
                }, 200).fadeOut(1000);
                this.destory();
            }
        });

    }
})