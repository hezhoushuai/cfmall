require(["/js/main.js"], function () {
    require(["jquery", "template", "head", "foot"], function ($, template, ss) {
        class Pay {
            constructor() {
                this.init();
                this.dataManger();
                this.addAddr();
                this.templateDetail();
            }

            init() {
                //关闭弹出框
                let _this = this;

                //点击提交框
                $(".tj").on("click", function () {
                    $("#pay_address_box").show();
                    $("#wrap_popup").show();
                    _this.Template("tmpl_popup_pay_address", {}, $("#pay_address_box"), false);
                    _this.addAddr();
                    _this.closeBox();
                    _this.btn_ok = $(".addres_btn_ok");
                });

                $("#wrap_popup").css({
                    "width": $(document).width() + "px",
                    "height": $(document).height() + "px",
                    "background": "#7f7f7f"
                })
            }

            closeBox() {
                //关闭弹出框
                $(".popup-close").on("click", function () {
                    $("#pay_address_box").toggle();
                    $("#wrap_popup").toggle();
                })
            }

            //处理数据
            dataManger() {
                let info = JSON.parse(localStorage.getItem("goodsinfo")),
                    data = [];
                $.each(info, function () {
                    if (this.checkStatus) {
                        data.push(this);
                    }
                })
                this.Template("goodsList", {
                    data
                }, $("tbody"));
            }

            //渲染模板
            //flag 确定加入到元素前还是覆盖元素
            Template(id, data, container, flag) {
                let html = template(id, data);
                if (flag) {
                    container.prepend(html)
                } else {
                    container.html(html);
                }
            }

            //点击列表，渲染输入框
            fixAdd() {
                let _this = this;
                $("#address-list").on("click", "li", function () {
                    if ($(this).attr("class") != "tj") {
                        let obj = {};
                        obj.flag = $(this).find("p").length;
                        obj.name = $(this).find(".name").text();
                        obj.address = $(this).find(".address").text();
                        obj.number = $(this).find(".number").text();
                        _this.Template("tmpl_popup_pay_address", obj, $("#pay_address_box"), false);
                        $("#pay_address_box").show();
                        $("#wrap_popup").show();
                        _this.closeBox();
                        _this.click = this;
                        _this.btn_ok = $(".addres_btn_ok");
                        _this.addAddr();

                    }
                })
            }

            //添加地址
            addAddr() {
                let _this = this;
                this.btn_ok = $(".addres_btn_ok");
                this.btn_ok.on("click", function () {
                    if ($("#popup_pay_address>h4")[0].getAttribute("flag") == "0") { //新增地址
                        let obj = {};
                        obj.receiver = $("#receiver").val();
                        obj.address = $("#address").val();
                        obj.number = $("#phoneNum").val();
                        _this.Template("addrList", obj, $("#address-list"), true);
                        _this.fixAdd();
                        $("#pay_address_box").hide();
                        $("#wrap_popup").hide();
                    } else { //修改地址
                        $(_this.click).find(".name").html($("#receiver").val());
                        $(_this.click).find(".address").html($("#address").val());
                        $(_this.click).find(".number").html($("#phoneNum").val());
                        $(".popup-close").trigger("click");
                    }
                    _this.templateDetail();
                })
            }

            //渲染下方详细信息列表
            templateDetail() {
                let first_li = $("#address-list").children(":first"),
                    name = first_li.find(".name").text(),
                    address = first_li.find(".address").text(),
                    number = first_li.find(".number").text(),
                    tr = $("tbody>tr"),
                    money = 0,
                    nums = 0;
                first_li.prop("class", "first_li");
                tr.each(function () {
                    nums += ($(this).find("#nums").text() - 0);
                    money += ($(this).find("#money").text().slice(0, -2) - 0)
                })
                let html = template("tmpl_pay_total", {
                    name,
                    address,
                    number,
                    money,
                    nums
                });
                $("#blk_pay_total").html(html);
            }
        }

        new Pay();
    })
})