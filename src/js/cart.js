require(["./main"], function () {
    require(["jquery", "template", "cartNum", "head", "foot"], function ($, template, cartNum) {

        class Cart {
            constructor() {
                this.info = JSON.parse(localStorage.getItem("goodsinfo"));
                this.is_goodsinfo();
                this.click();
                this.localCheckStatus(true, $("#checkAll>i"));
            }

            //点击图片跳转回详情页
            jumpToDetail() {
                $(".mycart-item").find("img").on("click", function () {
                    let id = $(this).parent().find(".buyNums").attr("data-id");
                    location.href = "/html/detail.html?id=" + id;
                })
            }

            //判断购物车是否为空
            is_goodsinfo() {
                if (this.info && this.info.length != 0) {
                    $(".no_goods").hide();
                    $(".cartContainer").show();
                    this.Template();
                } else {
                    $(".no_goods").show();
                    $(".cartContainer").hide();
                }
            }

            //渲染模板
            Template() {
                if (this.info && this.info.length != 0) {
                    let goodsinfo = JSON.parse(localStorage.getItem("goodsinfo")),
                        _this = this,
                        html = template("mycart_item", {
                            goodsinfo
                        });

                    $(".mycart-list").html(html);

                    //赋值给input
                    $("input").each(function () {
                        $(this).val($(this).next().html());
                    })
                    // for (var i = 0; i < $("input").length; i++) {
                    //     $("input")[i].value = $("input")[i].nextElementSibling.innerHTML;
                    // }
                    this.calc();
                    this.addNums();
                    this.checkAll();
                    this.checked();
                    this.delBtn();
                    this.jumpToDetail();
                }
            }


            //添加数量
            addNums() {
                let _this = this,
                    flagIndex;
                $("input").on("change", function () {
                    _this.info.map((item, index) => {
                        if (item.id == $(this).parent().attr("data-id")) { //确认该商品索引
                            flagIndex = index;
                        }
                    })

                    if ($(this).parent().find("input").val() - 0 >= _this.info[flagIndex].goodsNum - 0) {
                        $(this).parent().find("input").val(_this.info[flagIndex].goodsNum);
                    } else if ($(this).parent().find("input").val() - 0 <= 1) {
                        $(this).parent().find("input").val(1);
                    }
                    _this.info[flagIndex].buyNums = $(this).parent().find("input").val();
                    localStorage.setItem("goodsinfo", JSON.stringify(_this.info));
                    _this.calc();

                });

                $(".add").on("click", function () {
                    //得到对应的商品上限数量
                    _this.info.map((item, index) => {
                        if (item.id == $(this).parent().attr("data-id")) { //确认该商品索引
                            flagIndex = index;
                        }
                    })
                    if ($(this).parent().find("input").val() - 0 >= _this.info[flagIndex].goodsNum - 0) { //超出上限
                        $(this).parent().find("input").val(_this.info[flagIndex].goodsNum);
                    } else {
                        $(this).parent().find("input").val($(this).parent().find("input").val() - 0 + 1);
                    }
                    _this.info[flagIndex].buyNums = $(this).parent().find("input").val();
                    localStorage.setItem("goodsinfo", JSON.stringify(_this.info));
                    _this.calc();
                });

                $(".reduce").on("click", function () {
                    _this.info.map((item, index) => {
                        if (item.id == $(this).parent().attr("data-id")) { //确认该商品索引
                            flagIndex = index;
                        }
                    })
                    if ($(this).parent().find("input").val() - 0 <= 1) {
                        $(this).parent().find("input").val(1);
                    } else {
                        $(this).parent().find("input").val($(this).parent().find("input").val() - 1);
                    }
                    _this.info[flagIndex].buyNums = $(this).parent().find("input").val();
                    localStorage.setItem("goodsinfo", JSON.stringify(_this.info));
                    _this.calc();
                })
            }
            // 全选
            checkAll() {
                let _this = this;
                $("#checkAll").on("click", function () {
                    if ($(this).find("i").css("display") == "none") {
                        $(".checkBox").find("i").show();
                        $(this).find("i").show();
                    } else {
                        $(".checkBox").find("i").hide();
                        $(this).find("i").hide();
                    }
                    _this.calc();
                    _this.localCheckStatus(true, $(this).find("i"))
                })
            }
            //单选
            checked() {
                let _this = this;
                $(".checkBox").on("click", function () {
                    let ss = false,
                        id = $(this).parent().find(".buyNums").attr("data-id");
                    $(this).find("i").toggle();
                    $(".mycart-item").each(function () {
                        if ($(this).find(".checkBox").find("i").css("display") == "none") { //选中
                            ss = true;
                        }
                    })

                    if (ss) {
                        $("#checkAll").find("i").hide()
                    } else {
                        $("#checkAll").find("i").show();
                    }
                    _this.calc();
                    _this.localCheckStatus(false, $(this).find("i"), id);
                })
            }
            //计算总价
            calc() {
                let sum = 0,
                    count = 0;
                $(".mycart-item").each(function () {
                    if ($(this).find(".checkBox").find("i").css("display") != "none") { //选中
                        count += ($(this).find("input").val() - 0);
                        sum += $(this).find("input").val() * $(this).find(".item_price").find("span").text().slice(0, -1);
                    }
                    $(this).find(".money").html(($(this).find(".item_price").find("span").text().slice(0, -1) * $(this).find(".buyNums").find("input").val()).toFixed(2))
                })
                // for (var i = 0; i < $(".mycart-item").length; i++) {
                //     let flag = $($(".mycart-item")[i]);
                //     if (flag.find(".checkBox").find("i").css("display") != "none") { //选中
                //         count += (flag.find("input").val() - 0);
                //         sum += flag.find("input").val() * flag.find(".money").text().slice(0, -1);
                //     }
                // }
                $("#buy_nums").html(count);
                $("#total_price").html(sum.toFixed(2) + "元");
                cartNum();
            }
            click() {
                $(".no_goods").find("span").on("click", function () {
                    window.location.href = "/";
                })
            }
            // 删除按钮
            delBtn() {
                let _this = this;
                $(".delBtn").on("click", function () {
                    let id = $(this).parent().parent().find(".buyNums").attr("data-id");
                    _this.info.map((item, index) => {
                        if (item.id === id) {
                            _this.info.splice(index, 1);
                            localStorage.setItem("goodsinfo", JSON.stringify(_this.info));
                            //window.location.reload();
                            _this.info = JSON.parse(localStorage.getItem("goodsinfo"));
                            _this.is_goodsinfo();
                            _this.Template();
                        }
                    })
                })
            }
            //每次点击刷新localstroge选中状态
            //点击时更新localStroge
            //增加购买状态属性
            //container i标签用于判断是否选中
            //id 当前商品id
            //all 是否是全选按钮 blooen
            localCheckStatus(all, container, id) {
                let _this = this;
                $.each(_this.info, function () {
                    if (all) {
                        if (container.css("display") != "none") {
                            this.checkStatus = true;
                        } else {
                            this.checkStatus = false;
                        }
                    } else {
                        if (id == this.id) {
                            if (container.css("display") != "none") {
                                this.checkStatus = true;
                            } else {
                                this.checkStatus = false;
                            }
                        }
                    }
                })
                localStorage.setItem("goodsinfo", JSON.stringify(this.info))
            }
        }

        new Cart();
    })
})