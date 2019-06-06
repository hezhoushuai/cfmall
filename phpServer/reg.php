<?php
include("conn.php");

$username = $_POST["username"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$selSql = "select * from users where username='$username'";
$selRes = mysqli_num_rows(mysqli_query($con, $selSql));
if (!$selRes) {
    $insSql = "insert into users (username, password,phone) values ('$username', '$password','$phone')";
    $insRes = mysqli_query($con, $insSql);
    if ($insRes) {
        echo json_encode(array("res_code" => "1", "res_body" => "注册成功"));
    } else {
        echo json_encode(array("res_code" => "0", "res_body" => "网络错误！"));
    }
} else {
    echo json_encode(array("res_code" => "0", "res_body" => "注册失败，账号已存在"));
}
