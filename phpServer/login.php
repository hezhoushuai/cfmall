<?php
include("conn.php");
$username = $_POST["username"];
$password = $_POST["password"];
$selSql = "select * from users where username='$username' and password='$password'";
$selRes = mysqli_num_rows(mysqli_query($con, $selSql));
if (!$selRes) {
        echo json_encode(array("res_code" => "0", "res_body" => "账号或密码错误"));
} else {
    echo json_encode(array("res_code" => "1", "res_body" => "登录成功"));
}
