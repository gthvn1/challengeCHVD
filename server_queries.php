<?php

function select_massifs($dbh)
{
    $res = $dbh->query('SELECT * FROM massifs ORDER BY nom');

    echo '<td class="invisible"> Choix du massif </td>';
    echo '<td class="invisible">';
    echo '<select id="choix_massif_id" name="choix_massif_name" onChange="gmd_sommets()">';
    echo '<option value="none"> ------------- </option>';
    echo '<option value="0"> Nouveau Massif </option>';
    foreach ($res as $massif) {
        echo '<option value="', $massif['mid'], '">', $massif['nom'], '</option>';
    }
    echo '</select>';
    echo '</td>';
}

function select_sommets($dbh, $massif)
{
    $qry = $dbh->prepare('SELECT * FROM sommets WHERE mid = ? ORDER BY nom');
    $qry->execute(array($massif));
    $res = $qry->fetchAll();

    echo '<td class="invisible"> Choix du sommet </td>';
    echo '<td class="invisible">';
    echo '<select id="choix_sommet_id" name="choix_sommet_name" onChange="check_nouveau_sommet()">';
    echo '<option value="none"> ------------- </option>';
    echo '<option value="0"> Nouveau Sommet </option>';
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
    echo '<select id="choix_pilote_id" name="choix_pilote_name">';
    echo '<option value="none"> ------------- </option>';
    echo '<option value="0"> Nouveau pilote </option>';
    foreach ($res as $pilote) {
        echo '<option value="', $pilote['pid'], '">', $pilote['pseudo'], '</option>';
    }
    echo '</select>';
    echo '</td>';
}

function text_nouveau_sommet()
{
    // NOTE: cette zone sera ecrite entre deux balises <tr> et </tr>. Donc
    //       si on veut inserer des lignes faut agir en consequence.
    
    // Nom du sommet
    echo '<td class="invisible"> Nom du sommet </td> ';
    echo '<td class="invisible">';
    echo '<input type="text" name="choix_nouveau_sommet_name" />';
    echo '</td>';

    echo '</tr><tr>';

    // Saisie de l'altitude
    echo '<td class="invisible"> Altitude </td> ';
    echo '<td class="invisible">';
    echo '<input type="text" name="choix_nouveau_sommet_altitude_name" />';
    echo '</td>';

    echo '</tr><tr>';

    // Commentaire
    echo '<td class="invisible"> Commentaire </td> ';
    echo '<td class="invisible">';
    echo '<input type="text" name="choix_nouveau_sommet_commentaire_name" />';
    echo '</td>';
}

function pilotes_to_html($dbh)
{
    $result = $dbh->query('SELECT * FROM pilotes ORDER BY pseudo');

    echo '<table>';
    echo '<tr>';
    echo '<th> Pseudo </th>';
    echo '<th> Nom  </th>';
    echo '<th> Prenom </th>';
    echo '</tr>';

    foreach ($result as $pilote) {
        echo '<tr>';
        echo '<td>', $pilote['pseudo'], '</td>';
        echo '<td>', $pilote['nom'], '</td>';
        echo '<td>', $pilote['prenom'], '</td>';
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

    $val =  $_GET['param'];
    $massif =  $_GET['massif'];

    if (0 == strcmp($val, "select_pilotes")) {
        select_pilotes($dbh);
    }
    elseif (0 == strcmp($val, "select_massifs")) {
        select_massifs($dbh);
    }
    elseif (0 == strcmp($val, "select_sommets")) {
        select_sommets($dbh, $massif);
    }
    elseif (0 == strcmp($val, "text_nouveau_sommet")) {
        text_nouveau_sommet();
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
