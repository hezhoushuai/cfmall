define(["jquery", "cartNum"], function ($, cartNum) {
    class Footer {
        constructor() {
            this.init().then(() => {
                this.cart();
            })
        }
        init() {
            return new Promise((resolve, reject) => {
                $("#footerpage").load("/html/moudle/foot.html", function () {
                    resolve();
                });
            })
        }
        // 购物车总数
        cart() {
            cartNum();
        }
    }
    new Footer();
})