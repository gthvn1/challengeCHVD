<?php

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $result = $dbh->query('SELECT * FROM pilotes');

    echo '<table>';
    echo '<tr>';
    echo '<th> Nom  </th>';
    echo '<th> Prenom </th>';
    echo '<th> Pseudo </th>';
    echo '</tr>';

    foreach ($result as $pilote) {
        echo '<tr>';
        echo '<td>', $pilote['nom'], '</td>';
        echo '<td>', $pilote['prenom'], '</td>';
        echo '<td>', $pilote['pseudo'], '</td>';
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
