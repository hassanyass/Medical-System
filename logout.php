<?php
require 'con.php';
$_SESSION = [];
session_unset();
session_destroy();
header("Location: login.php");
?>