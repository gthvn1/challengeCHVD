<?php

function choix_massif($dbh)
{
    $result = $dbh->query('SELECT * FROM massifs');

    echo '<td class="invisible"> Choix du massif </td>';
    echo '<td class="invisible">';
    echo '<select name="massif">';
    echo '<option> Nouveau Massif </option>';
    foreach ($result as $massif) {
        echo '<option>', $massif['nom'], '</option>';
    }
    echo '</select>';
    echo '</td>';
}


function pilotes_to_html($dbh)
{
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
}

function massifs_to_html($dbh)
{
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
}

function sommets_to_html($dbh)
{
    echo '<table>';
    echo '<tr>';
    echo '<th> Nom du sommet </th>';
    echo '<th> Altitude </th>';
    echo '<th> Points </th>';
    echo '<th> Année </th>';
    echo '<th> Commentaire </th>';
    echo '</tr>';
   
    $result = $dbh->query('SELECT * FROM sommets');

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
}

function volrandos_to_html($dbh)
{
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
}

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $val =  $_GET['param'];

    if (0 == strcmp($val, "choix_massif")) {
        choix_massif($dbh);
    }
    elseif (0 == strcmp($val, "pilotes")) {
        pilotes_to_html($dbh);
    }
    elseif (0 == strcmp($val, "massifs")) {
        massifs_to_html($dbh);
    }
    elseif (0 == strcmp($val, "sommets")) {
       sommets_to_html($dbh);
    }
    else {
        volrandos_to_html($dbh);
    }

    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}

?>
