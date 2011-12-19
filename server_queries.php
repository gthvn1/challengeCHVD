<?php

function ajout_volrando($dbh, $mid)
{
    echo 'vol ajoute: mid = ', $mid;
}

function select_massifs($dbh)
{
    $res = $dbh->query('SELECT * FROM massifs ORDER BY nom');

    echo '<td class="invisible"> Choix du massif </td>';
    echo '<td class="invisible">';
    echo '<select id="choix_massif_id" onChange="gmd_sommets()">';
    echo '<option value="0"> selectionner un massif </option>';
    foreach ($res as $massif) {
        echo '<option value="', $massif['mid'], '">', $massif['nom'], '</option>';
    }
    echo '</select>';
    echo '</td>';
}

function select_sommets($dbh, $mid)
{
    $qry = $dbh->prepare('SELECT * FROM sommets WHERE mid = ? ORDER BY nom');
    $qry->execute(array($mid));
    $res = $qry->fetchAll();

    echo '<td class="invisible"> Choix du sommet </td>';
    echo '<td class="invisible">';
    echo '<select id="choix_sommet_id" onChange="sommet_selected()">';
    echo '<option value="0"> Choisir un sommet </option>';
    foreach ($res as $sommet) {
        echo '<option value="', $sommet['sid'], '">', $sommet['nom'], '</option>';
    }
    echo '</select>';
    echo '</td>';
}

function select_pilotes($dbh)
{
    $res = $dbh->query('SELECT * FROM pilotes ORDER BY pseudo');

    echo '<td class="invisible"> Choix du pilote </td>';
    echo '<td class="invisible">';
    echo '<select id="choix_pilote_id" onChange="pilote_selected()">';
    echo '<option value="0"> selectionner un pilote </option>';
    foreach ($res as $pilote) {
        echo '<option value="', $pilote['pid'], '">', $pilote['pseudo'], '</option>';
    }
    echo '</select>';
    echo '</td>';
}

function pilotes_to_html($dbh)
{
    $result = $dbh->query('SELECT * FROM pilotes ORDER BY pseudo');

    echo '<table>';
    echo '<tr>';
    echo '<th> Pseudo </th>';
    echo '</tr>';

    foreach ($result as $pilote) {
        echo '<tr>';
        echo '<td>', $pilote['pseudo'], '</td>';
        echo '</tr>';
    }
    echo '</table>';
}

function massifs_to_html($dbh)
{
    $result = $dbh->query('SELECT * FROM massifs ORDER BY nom');

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
    echo '<th> Id du massif </th>';
    echo '<th> Altitude </th>';
    echo '<th> Points </th>';
    echo '<th> Année </th>';
    echo '<th> Commentaire </th>';
    echo '</tr>';
   
    $result = $dbh->query('SELECT * FROM sommets ORDER BY nom');

    foreach ($result as $sommet) {
        echo '<tr>';
        echo '<td>', $sommet['nom'], '</td>';
        echo '<td>', $sommet['mid'], '</td>';
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
    echo '<th> Vol ID </th>';
    echo '<th> Sommet ID </th>';
    echo '<th> Pilote ID </th>';
    echo '<th> Date </th>';
    echo '<th> Biplace </th>';
    echo '<th> Carbone </th>';
    echo '<th> Commentaire </th>';
    echo '</tr>';

    foreach ($result as $volrando) {
        echo '<tr>';
        echo '<td>', $volrando['vid'], '</td>';
        echo '<td>', $volrando['sid'], '</td>';
        echo '<td>', $volrando['pid'], '</td>';
        echo '<td>', $volrando['date'], '</td>';
        echo '<td>', $volrando['biplace'], '</td>';
        echo '<td>', $volrando['carbone'], '</td>';
        echo '<td>', $volrando['commentaire'], '</td>';
        echo '</tr>';
    }
    echo '</table>';
}

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $val    =  $_GET['param'];

    // Info pour l'ajout du vol
    $mid  =  $_GET['mid'];
    $nm   =  $_GET['nm'];
    $sid  =  $_GET['sid'];
    $ns   =  $_GET['ns'];
    $alti =  $_GET['alti'];
    $pts  =  $_GET['pts'];
    $cs   =  $_GET['cs'];
    $pid  =  $_GET['pid'];
    $np   =  $_GET['np'];
    $date =  $_GET['date'];
    $bi   =  $_GET['bi'];
    $md   =  $_GET['md'];
    $cv   =  $_GET['cv'];


    if (0 == strcmp($val, "ajout_volrando")) {
        ajout_volrando($dbh, $mid);
    }
    elseif (0 == strcmp($val, "select_pilotes")) {
        select_pilotes($dbh);
    }
    elseif (0 == strcmp($val, "select_massifs")) {
        select_massifs($dbh);
    }
    elseif (0 == strcmp($val, "select_sommets")) {
        select_sommets($dbh, $mid);
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
    elseif (0 == strcmp($val, "volrandos")) {
        volrandos_to_html($dbh);
    }
    else {
        echo '<p class="invalide"> LE SERVEUR NE PEUT REPONDRE A VOTRE DEMANDE </p>';
    }

    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}

?>
