define(["jquery", "template", "login"], function ($, template, Login) {
    class Head {
        constructor(className) {
            this.className = className;
            this.liStatus;
            this.class_name = decodeURIComponent(location.href.replace(/^.*=/, ""));
            this.init().then(() => {
                this.noticeScrool();
                this.topMenu();
                this.allClass();
                this.sosoBox();
                this.loginBox();
                this.exitLogin();
                this.topMenuClick();
                this.shopCart();
                this.infoToUser();
            })
        }

        init() {
            return new Promise((resolve, reject) => {
                $("#headerpage").load("/html/moudle/header.html", function () {
                    resolve();
                });
            })

        }
        //顶部公告滚动事件
        noticeScrool() {
            let left = 0;
            setInterval(function () {
                left += 30;
                if (left > 60) left = 0;
                $(".top-notice").find("ul").css({
                    position: "absolute",
                    top: -left + "px"
                })
            }, 3000)
        }
        // 顶部菜单hover事件
        topMenu() {
            let _this = this;
            $("#topMenu").on("mouseenter", "li", function (e) {
                $(this).addClass("cur");
                $("#topMenu").on("mouseleave", "li", function (e) {
                    $(this).removeClass("cur")
                    if (_this.liStatus) {
                        _this.liStatus.addClass("cur");
                    }

                })
            })

            $("#topMenu").on("click", "li", function (e) {
                $(this).addClass("cur");
                _this.liStatus = $(this);

            })
            this.topMenuTrigger();
        }
        topMenuTrigger() {
            let _this = this;
            $("#topMenu").find("li").each(function () {
                if ($(this).text() == _this.class_name) {
                    $(this).trigger("click");
                }
            })

        }

        // 所有种类事件
        allClass() {
            let submenu = $("#top-submenu"),
                allclass = $(".all-class");
            submenu.hide();
            allclass.on("mouseenter", function (e) {
                $(".i-arrbot").addClass("i-arrtop");
                submenu.show();
                allclass.on("mouseleave", function () {
                    $(".i-arrbot").removeClass("i-arrtop");
                    submenu.hide();
                })

            })
            submenu.on("mouseenter", function () {
                submenu.show();
                submenu.on("mouseleave", function (e) {
                    //划过隐藏全部分类
                    $(".i-arrbot").removeClass("i-arrtop");
                    submenu.hide();
                })
            })
        }
        // 搜索框事件
        sosoBox() {
            let searchList = $(".top-searchList"),
                inputSearch = $("#input_header_search");
            inputSearch.on("keyup", function () {
                let val = $(this).val().trim();
                if (val) {
                    $.getJSON("https://suggest.taobao.com/sug?code=utf-8&&callback=?&q=" + val, res => {
                        if (res.result.length) {
                            let list = [];
                            //使搜索结果只有五个                         
                            $.each(res.result, function (i, n) {
                                if (i < 5) {
                                    list.push(n);
                                }
                            })
                            let html = template("top_searchList", {
                                list
                            })
                            $(".top-searchList").html(html);
                        }
                    });

                    searchList.show();
                } else {
                    //没有内容时隐藏
                    searchList.hide();
                }
            })
            inputSearch.on("blur", function () {
                setTimeout(function () {
                    searchList.hide();
                }, 500)
            })
            searchList.on("click", "li", function () {
                inputSearch.val($(this).html());
                searchList.hide();
            })
        }
        //登录框内容
        loginBox() {

            //登录框事件
            $("#unlogin").on("click", () => {
                let _this = this;
                let box = $("#web_loginbox");
                let unlogin = new Promise((resolve, reject) => {
                    box.load("/html/moudle/login.html", function () {
                        resolve();
                    }).css("display", "block");
                });
                unlogin.then(() => {
                    let loginInfo = new Login(_this.infoToUser);
                    this.center();
                    window.onresize();
                    $("body").css("overflow", "hidden");
                    //input框,外边框
                    box.find("input").on("focus", function () {
                        $(this).css("border", "1px solid #31a4f6");
                        box.find("input").on("blur", function () {
                            $(this).css("border", "1px solid #d5d5d5");
                        })
                    })
                    $(".web_login_top").on("click", "li", function () {
                        $(this).prev().removeClass("ac");
                        $(this).addClass("ac");
                        $(this).next().removeClass("ac");

                    })
                    //关闭登录框
                    $("#close_box").on("click", () => {
                        $("body").css("overflow", "auto");
                        box.css("display", "none");
                    })
                    //登录按钮
                    //阻止默认事件
                    box.find("button").on("click", function () {
                        return false;
                    })
                })
            })
        }
        //登陆后显示用户消息
        infoToUser() {

            let userinfo = JSON.parse(localStorage.getItem("userinfo")),
                unlogin = $("#unlogin"),
                loginBox = $("#loginbox");
            if (!userinfo) { //未登录
                unlogin.css("display", "block");
                loginBox.css("display", "none");
            } else { //登录后
                unlogin.css("display", "none");
                loginBox.css("display", "block");
                $("#top_head_username").html(userinfo.username);
                $("#loginbox img").attr("src", userinfo.photo);
            }
        }
        exitLogin() {
            //退出登录事件
            $("#exit_login").on("click", () => {
                localStorage.clear("userinfo");
                this.loginBox();
                window.location.reload();
            })
        }
        //登录框居中
        center() {
            window.onresize = function () {
                let box1 = $("#web_loginbox").find(".web_login");
                let top = ($(window).height() - box1.height()) / 2;
                let left = ($(window).width() - box1.width()) / 2;
                $("#web_loginbox").height($(window).height());
                box1.css({
                    "top": top + "px",
                    "left": left + "px"
                });
            }
        }
        // top菜单点击跳转大类事件
        topMenuClick() {
            $("#topMenu").on("click", "li", function () {
                if ($(this).text() !== "首页") {
                    window.open("/html/productlist.html?class=" + $(this).text());
                } else {
                    window.open("/");
                }
            })
        }
        //购物车
        shopCart() {
            $(".carbox").on("click", function () {
                let userinfo = JSON.parse(localStorage.getItem("userinfo"));
                if (!userinfo) {
                    $(".carbox").attr("href", "javascript:void(0);");
                    $("#unlogin").trigger("click");
                } else {
                    $(".carbox").attr("href", "/html/cart.html");
                }
            })

        }
    }
    new Head();
    return Head;

})