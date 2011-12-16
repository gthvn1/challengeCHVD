<?php

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $result = $dbh->query('SELECT * FROM volrandos');

    echo '<table>';
    echo '<tr>';
    echo '<th> Date </th>';
    echo '</tr>';

    foreach ($result as $volrando) {
        echo '<tr>';
        echo '<td>', $volrando['date'], '</td>';
        echo '</tr>';
    }
    echo '</table>';

    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}

?>
