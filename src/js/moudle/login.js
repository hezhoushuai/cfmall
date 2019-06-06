define(["jquery"], function ($) {
    class Login {
        constructor(show) {
            this.show = show;
            this.init();
        }
        init() {

            this.loginBtn();
        }

        loginBtn() {
            let _this = this;
            $("button").on("click", function () {
                let password = $("#pwd").val(),
                    username = $("#username").val();
                if (password && username) {
                    $.post("http://localhost/login.php", {
                        username,
                        password
                    }, function (res) {
                        let result = JSON.parse(res);
                        if (result.res_code - 0) {
                            let data = {
                                username,
                                photo: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2395468711,188642584&fm=26&gp=0.jpg"
                            };
                            $("#close_box").trigger("click");
                            console.log(JSON.stringify(data))
                            localStorage.setItem("userinfo", JSON.stringify(data));
                            _this.show();
                        } else {
                            alert(result.res_body);
                        }
                    });
                } else {
                    alert("输入账号或密码");
                }
            })
        }
    }
    return Login;
})