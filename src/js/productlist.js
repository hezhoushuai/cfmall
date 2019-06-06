require(["/js/main.js"], function () {
    require(["jquery", "template", "head", "foot", "login", "loding"], function ($, template, Head) {
        class List {
            constructor() {
                $.mask_fullscreen(500);
                this.nowPage = 1;
                this.class_name = decodeURIComponent(location.href.replace(/^.*=/, ""));
                new Head(this.class_name);
                this.init();
                this.btnClick();
            }
            init() {
                // this.topmenu();
                let _this = this;
                $(".topbar li").each(function () {
                    if ($(this).text() == _this.class_name) {
                        $(this).addClass("cur");
                    }

                })
                $("#class_name_span").text(this.class_name);
                //转换得到class_id
                switch (this.class_name) {
                    case "全部":
                        this.class_id = 0;
                        break;
                    case "数码外设":
                        this.class_id = 1;
                        break;
                    case "家居日用":
                        this.class_id = 2;
                        break;
                    case "模型手办":
                        this.class_id = 3;
                        break;
                    case "包类专区":
                        this.class_id = 4;
                        break;
                }
                if (this.class_name == "数码外设") {
                    this.class_num = "1";
                }
                this.getData();
            }
            //模拟点击顶部
            //按钮点击事件
            btnClick() {
                let count = 0,
                    prev;
                $(".class_bar").on("click", "li", function () {
                    //限定范围为下面的ul
                    //初始化ul
                    if ($(this).text() != prev) {
                        prev = $(this).text();
                        count = 0;
                    }
                    if ($(this).attr("class") != "class_li") {
                        $(this).siblings().find("i").removeClass("i-checked")
                        $(this).siblings().find("i").removeClass("i-arrbtop").removeClass("i-arrbbot");
                        $(this).addClass("cur").siblings().removeClass("cur");
                    }
                    if ($(this).parent(".topbar").length) {
                        $("#topMenu li").each((index, item) => {
                            if ($(this).text() == $(item).text()) {
                                $(item).trigger("click")
                            }
                        })
                    }
                    //左侧排序
                    if ($(this).parent(".first_ul").length) {
                        if (count++ == 0) {
                            $(this).find(".ico-comm").addClass("i-arrbtop");
                            $(this).find("i").removeClass("i-arrbbot");
                        } else {
                            $(this).find("i").addClass("i-arrbbot");
                            $(this).find("i").removeClass("i-arrbtop");
                            count = 0;
                        }
                    }
                })
            }
            getData() {
                $.get("http://rap2api.taobao.org/app/mock/163722/api/listitem?class_id=" + this.class_id, res => {
                    if (res.res_code == 1) {
                        //总共有的页码
                        this.renderOption(res.res_body.data);
                        this.dataManage(res.res_body.data);
                        this.goodsSort_left(res.res_body.data);
                        this.goodsSort_right(res.res_body.data);
                        // this.switchPage(res.res_body.data);
                    } else {
                        alert("网络错误");
                    }
                })
            }
            //渲染切换选项卡
            renderOption(data) {
                let page_Nums = $("#page_Nums"),
                    ht, pageNum = Math.ceil(data.list.length / 12);
                page_Nums.empty();
                if (pageNum == 0) pageNum = 1;
                for (let i = 1; i <= pageNum; i++) {
                    if (i == 1) ht = $("<li data-page=" + i + " class='active'></li>").html(i);
                    else ht = $("<li data-page=" + i + "></li>").html(i);
                    page_Nums.append(ht);
                }
                // page_Nums.html();
            }
            //数据管理
            dataManage(data, newPages) {
                let nowPage = newPages || this.nowPage,
                    pageData = {
                        list: data.list.slice((nowPage - 1) * 12, nowPage * 12)
                    };
                this.renderGoods(pageData, data);

            }
            //渲染商品列表
            renderGoods(pageData, data) {
                let html = template("p-list", pageData);
                $("#goods_container").html(html);
                this.switchPage(data);
            }
            //点击切换
            switchPage(data) {
                let _this = this;
                $("#page_Nums").on("click", "li", function () {
                    if ($(this).attr("class") != "active") {
                        _this.nowPage = $(this).attr("data-page");
                        _this.dataManage(data);
                        $(this).addClass("active").siblings().removeClass("active");
                    }

                })
            }
            //点击排序
            //false 默认状态降序状态 true 升序状态
            goodsSort_left(data) {
                let priceSort,
                    isNew = true,
                    popular,
                    saleSort,
                    _this = this,
                    arr,
                    temp,
                    list, res_data;
                //左侧排序
                $(".first_ul").on("click", "li", function () {
                    switch ($(this).text()) {
                        case "价格":
                            if (!priceSort) { //升序状态
                                list = _this.sort(data.list, "goods_price", !priceSort);
                            } else {
                                list = _this.sort(data.list, "goods_price", !priceSort);
                            }
                            priceSort = !priceSort; //转换状态
                            break;
                        case "新品":
                            arr = data.list;
                            for (let i = 0; i < arr.length; i++) {
                                for (let j = arr.length - 1; j > i; j--) {
                                    if (arr[j]["isNew"] == isNew) {
                                        temp = arr[j];
                                        arr[j] = arr[j - 1];
                                        arr[j - 1] = temp;
                                    }
                                }
                            }
                            isNew = !isNew;
                            break;
                        case "人气":
                            if (!popular) { //升序状态
                                list = _this.sort(data.list, "popular", !popular);
                            } else {
                                list = _this.sort(data.list, "popular", !popular);
                            }
                            popular = !popular; //转换状态
                            break;
                        case "销量":
                            if (!saleSort) { //升序状态
                                list = _this.sort(data.list, "saleNum", !saleSort);
                            } else {
                                list = _this.sort(data.list, "saleNum", !saleSort);
                            }
                            saleSort = !saleSort; //转换状态
                            break;
                    }
                    res_data = {
                        list
                    };
                    _this.dataManage(res_data);
                    _this.renderOption(res_data);
                })

            }
            //右侧排序
            goodsSort_right(data) {
                //右侧排序
                let _this = this,
                    arr,
                    num, mail, count,
                    res_data,
                    count1 = false,
                    prev,
                    first_ul = $(".first_ul");
                $(".last_ul").on("click", "li", function () {
                    if ($(this).text() != prev) {
                        prev = $(this).text();
                        count1 = 0;
                    }
                    if (count1) {
                        $(this).find(".ico-comm").removeClass("i-checked");
                        count1 = !count1;
                    } else {
                        $(this).find(".ico-comm").addClass("i-checked");
                        count1 = !count1;
                    }

                    arr = data.list.concat([]);
                    switch ($(this).text()) {
                        case "有货":
                            if (!num) {
                                for (var i = arr.length - 1; i >= 0; i--) {
                                    if (arr[i]["num"] == 0) {
                                        arr.splice(i, 1)
                                    }
                                }
                            } else {
                                first_ul.find("li").removeClass("cur").find(".class_li").next().addClass("cur");
                                arr = data.list.concat([]);
                            }
                            num = !num;
                            mail = count = false;
                            break;
                        case "包邮":

                            if (!mail) {
                                for (var i = arr.length - 1; i >= 0; i--) {
                                    if (!arr[i]["mail"]) {
                                        arr.splice(i, 1)
                                    }
                                }
                            } else {
                                arr = data.list.concat([]);
                            }
                            mail = !mail;

                            num = count = false;
                            break;
                        case "聚豆可抵":
                            if (!count) {
                                for (var i = arr.length - 1; i >= 0; i--) {
                                    if (!arr[i]["counteract"]) {
                                        arr.splice(i, 1)
                                    }
                                }
                            } else {
                                arr = data.list.concat([]);
                            }
                            count = !count;
                            mail = num = false;
                            break;
                    }
                    res_data = {
                        list: arr
                    };
                    _this.dataManage(res_data, 1);
                    _this.renderOption(res_data);
                    _this.goodsSort_left(res_data);
                })
            }
            //排序算法
            //arr数组
            //需要排序的元素
            //升序或降序 blooen
            sort(arr, ele, isUp) {
                let temp = 0;
                for (let i = 0; i < arr.length; i++) {
                    for (let j = arr.length - 1; j > i; j--) {
                        if (arr[j][ele] > arr[j - 1][ele]) {
                            temp = arr[j];
                            arr[j] = arr[j - 1];
                            arr[j - 1] = temp;
                        }
                    }
                }
                if (isUp) { //升序
                    return arr.reverse();
                } else {
                    return arr;
                }
            }

        }
        new List();
    })
})