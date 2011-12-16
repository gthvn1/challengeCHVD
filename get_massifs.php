<?php

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $result = $dbh->query('SELECT * FROM massifs');

    echo '<table>';
    echo '<tr>';
    echo '<th> Nom du massif </th>';
    echo '</tr>';

    foreach ($result as $massif) {
        echo '<tr>';
        echo '<td>', $massif['nom'], '</td>';
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
