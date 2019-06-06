require(["main"], function () {
    require(["jquery", "template", "cartNum", "flyToCar", "cloudzoom", "head", "foot"], function ($, Template, cartNum, flyToCar) {
        class Detail {
            constructor() {
                this.inputVal = 1;
                this.id = decodeURIComponent(location.href.replace(/^.*=/, ""));
                this.getData();
            }
            init() {}
            show() {
                //放大镜效果
                CloudZoom.quickStart();
                let ul = $(".mid_head"),
                    callMe = $(".callMe"),
                    parameter = $(".parameter"),
                    pord_comment = $(".pord-comment");
                    //详情选项卡切换
                ul.on("click", "li", function () {
                    $(this).find("i").show();
                    $(this).siblings().find("i").hide();
                    if ($(this).text() == "商品详情") {
                        callMe.hide();
                        parameter.show();
                        pord_comment.hide();
                    } else if ($(this).text() == "联系商家") {
                        callMe.show();
                        parameter.hide();
                        pord_comment.hide();
                    } else {
                        callMe.hide();
                        parameter.hide();
                        pord_comment.show();
                    }
                })
                $(".letter_pic").on("click", "li", function () {
                    $(this).css("border", "2px solid #f74a4a");
                    $(this).siblings().css("border", "");
                })
            }
            //得到数据
            getData() {
                $.get("http://rap2api.taobao.org/app/mock/163722/good_detail?good_id=" + this.id, res => {
                    this.dataManage(res.res_body)
                })
            }
            //数据处理
            dataManage(data) {
                data.data[0].goods_price = data.data[0].goods_price.toFixed(2);
                data.data[0].fa_price = data.data[0].fa_price.toFixed(2);
                data.data[0].old_price = data.data[0].old_price.toFixed(2);
                this.stock = data.data[0].stock;
                this.template(data);
            }
            //渲染数据
            template(data) {
                let html = Template("top_detail_container", data);
                $(".top_detail").html(html);
                html = Template("mid_detail_container", data);
                $(".mid_containner").html(html);
                this.show();
                this.addCart();
            }
            //添加购物车
            addCart() {
                //添加减少数量
                let _this = this,
                    buynums = $("#buyNums");
                buynums.on("change", function () {
                    if ($(this).val() >= _this.stock) {
                        buynums.val(_this.stock);
                    } else if ($(this).val() - 0 <= 1) {
                        buynums.val(1);
                    }
                    _this.inputVal = $(this).val() - 0;
                })
                $("#add").on("click", function () {
                    if (buynums.val() >= _this.stock) {
                        buynums.val(_this.stock);
                    } else {
                        buynums.val(_this.inputVal + 1);
                    }
                    _this.inputVal = buynums.val() - 0;
                });
                $("#reduce").on("click", function () {

                    if (buynums.val() - 0 <= 1) {
                        buynums.val(1);
                    } else {
                        buynums.val(_this.inputVal - 1);
                    }
                    _this.inputVal = buynums.val() - 0;
                })
                this.local();
                this.btnClick();
            }

            //添加localstorage
            local() {
                let _this = this;
                $(".addCar").on("click", function (e) {
                    _this.showOkWindow(e);

                    cartNum();
                })
            }

            showOkWindow(e) {
                let userinfo = localStorage.getItem("userinfo"),
                    goodsinfo = JSON.parse(localStorage.getItem("goodsinfo")),
                    id = this.id,
                    goodName = $(".top_detail_right").find("h1").text(),
                    buyNums = $("#buyNums").val() - 0,
                    img = $(".letter_pic").children(":first").children().attr("src"),
                    price = $(".good_price").find("em").text(),
                    old_price = $(".good_price").find("span").text().slice(1, -1),
                    shopName = $("#shopName").text(),
                    goodsNum = $("#repertory").text().slice(3, -2),
                    flag = false,
                    flagIndex;

                if (userinfo && userinfo.length != 0) {
                    let info = {
                        id,
                        goodName,
                        buyNums,
                        img,
                        price,
                        shopName,
                        goodsNum,
                        old_price
                    };
                    //飞入购物车
                    flyToCar(e, "#blk_footer_tool", "#img", "#msg");
                    //展示添加成功框
                    $("#addCart").show();
                    if (goodsinfo) { //存在商品
                        //遍历购物车
                        goodsinfo.map(function (item, index) {
                            if (item.id == id) { //购物车存在该商品
                                flag = true;
                                flagIndex = index;
                            }
                        })
                        if (flag) { //存在该商品
                            goodsinfo[flagIndex].buyNums = goodsinfo[flagIndex].buyNums - 0 + buyNums;
                        } else { //不存在该商品
                            goodsinfo.push(info);
                        }
                        localStorage.setItem("goodsinfo", JSON.stringify(goodsinfo));
                    } else { //第一次添加商品
                        localStorage.setItem("goodsinfo", JSON.stringify([info]));
                    }
                } else { //未登录
                    $("#unlogin").trigger("click");
                }
            }
            // 购物车按钮
            btnClick() {
                //确定按钮
                $("#okBtn").on("click", function () {
                    window.location.href = "/html/cart.html";
                })
                //继续购物按钮
                $("#again").on("click", function () {
                    $("#addCart").hide();
                })
                //关闭提示框
                $(".closeBox").on("click", function () {
                    $("#addCart").hide();
                })
            }
        }
        new Detail();

    })
})