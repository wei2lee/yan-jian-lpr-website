<?php
//error_reporting(0);

$config = array(
    "db" => array(
        "user" => "root",
        "pass" => "",
        "host" => "localhost",
        "db" => ""),
    
    "smtp" => array(
        "user" => "lake6253",
        "pass" => "eq3q@5f34$",
        "host" => "mail.lakepointresidence.com.my",
        "port" => 587
    ),
    
    "publicPath" => realpath(dirname(__FILE__)),
    "uploadPath" => realpath(dirname(__FILE__)) . '/upload',
);
?>