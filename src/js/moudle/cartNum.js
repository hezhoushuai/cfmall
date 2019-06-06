define(['jquery'], function ($) {
    return function () {
        let info = JSON.parse(localStorage.getItem("goodsinfo")),
            sum = 0;
        if (info && info != []) {
            info.forEach(function (item) {
                sum += (item.buyNums - 0);
            })
            $(".navico-cartnum").html(sum);
        } else {
            $(".navico-cartnum").html(0);
        }
    }

});