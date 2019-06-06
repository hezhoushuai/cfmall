<?php
error_reporting(E_ALL^E_NOTICE);
header("Access-Control-Allow-Origin:*");
$config = array(
    'dbname' => "users",
    'username' => "root",
    'password' => "root",
    'host' => '127.0.0.1'
);
$con = mysqli_connect($config['host'], $config['username'], $config['password']);
$res = mysqli_select_db($con, $config["dbname"]);
mysqli_query($con,"set charset 'utf8'");
mysqli_query($con,"set character set 'utf8'");