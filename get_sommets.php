<?php

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $result = $dbh->query('SELECT * FROM sommets');

    echo '<table>';
    echo '<tr>';
    echo '<th> Nom du sommet </th>';
    echo '<th> Altitude </th>';
    echo '<th> Points </th>';
    echo '<th> Année </th>';
    echo '<th> Commentaire </th>';
    echo '</tr>';

    foreach ($result as $sommet) {
        echo '<tr>';
        echo '<td>', $sommet['nom'], '</td>';
        echo '<td>', $sommet['altitude'], '</td>';
        echo '<td>', $sommet['points'], '</td>';
        echo '<td>', $sommet['annee'], '</td>';
        echo '<td>', $sommet['commentaire'], '</td>';
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
