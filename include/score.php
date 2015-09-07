<?php

// Settings.
$databaseUser = "inertia";
$databasePass = "m1475369";
$databaseName = "inertia2";
$databaseTable = "breakin";
$databaseHost = "localhost";

// Attempt to open a connection to the database.
mysql_connect($databaseHost, $databaseUser, $databasePass);
mysql_select_db($databaseName);

$getName = $_GET['name'];
$getScore = $_GET['score'];

if ($getName && $getScore) {

    if ($getScore % 100 == 0) {

        $getName = strip_tags($getName);

        $sql = "INSERT INTO $databaseTable (id,name,value) VALUES ('', '$getName','$getScore')";
        $result = mysql_query($sql);

    }

} else {

    $sql = "SELECT * FROM $databaseTable ORDER BY 3 DESC LIMIT 5";
    $result = mysql_query($sql);
    
    print "<ul>\n";
    for($i = 0; $i < mysql_num_rows($result); $i++) {
        $name = mysql_result($result, $i, "name");
        $score = mysql_result($result, $i, "value");    
        print "<li><strong>".$score."</strong> ".$name."</li>\n";    
    }
    print "</ul>\n";

}

mysql_close();

?>