require(['/js/main.js'], function () {
    require(["jquery", "Swiper"], function ($, Swiper) {
        class Reg {
            constructor() {
                this.init();
                this.swiper();
                this.save();
            }
            init() {

            }
            //轮播图插件
            swiper() {
                new Swiper('.swiper-container', {
                    loop: true,
                    noSwiping: true,
                    noSwipingSelector: 'img',
                    noSwiping: true,
                    autoplay: {
                        delay: 1500, //1秒切换一次
                    },
                });
            }
            //jsonp跨域
            save() {
                let _this = this;

                $("#get_acc").on("click", function () {
                    let username = $("#username").val(),
                        password = $("#password").val(),
                        phone = $("#phone").val();
                    if (username && password && phone && $(".checkbox").is(":checked")) {

                        $.post("http://localhost/reg.php", {
                            username,
                            password,
                            phone
                        }, function (res) {
                            let result = JSON.parse(res)
                            console.log(result)
                            if(result.res_code){
                                alert("注册成功");
                            }else{
                                alert("注册失败，重新注册");
                            }
                        });
                    } else {
                        alert("输入有误！");
                    }


                })
            }
        }
        new Reg();


    })
})