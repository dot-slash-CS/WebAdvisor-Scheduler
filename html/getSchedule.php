<?php
$i = intval($_GET('i'));
$s = inval($_GET('s'));

$con = mysqli_connect('localhost','root','password','Schedule');
if (!$con) (
    die('Could not connect: ' .mysqli_error($con));
)

mysqli_select_db($con,"ajax_demo");
$sql="SELECT schedules FROM dotslash WHERE id = '".$i."'";
$json = mysqli_query($con,$sql);

$data = json_decode ($json);
echo $data[strval($s)];
mysqli_close($con);
?>