require(["/js/main.js"], function () {
    require(["jquery", "Swiper", "template", "head", "foot", "login"], function ($, Swiper, template, Head) {
        class Index {
            constructor() {
                this.swiper();
                this.getData();
            }
            init() {

            }
            //轮播图
            swiper() {
                new Swiper('.swiper-container', {
                    autoplay: true, //可选选项，自动滑动
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                        dynamicBullets: true,
                    },
                })
            }
            //得到数据
            getData() {
                $.get("http://rap2api.taobao.org/app/mock/163722/list/index-tit", res => {
                    this.dataManger(res);
                });
            }
            //处理数据
            dataManger(data) {
                data.res_body.data.list.forEach(function (item) {
                    item.goods.good.forEach(function (value) {
                        value.good_price = value.good_price.toFixed(2);
                    })
                })
                this.templateClass(data);
            }
            //渲染类名
            templateClass(data) {
                let html = template("container_data", data.res_body.data);
                $(".container").html(html);
            }
        }
        new Index();
    })
})