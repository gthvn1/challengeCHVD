<?php

function get_and_convert($db, $rq, $name, $etiquettes)
{
    $qry = $db->prepare($rq);
    $qry->execute();
    $table_sql = $qry->fetchAll();
    add_data($table_sql, $name, $etiquettes);
}

function add_data($table, $name, $etiquettes)
{
    $nbm = count($table);

    for ($i=0; $i < $nbm; $i++) {
        // Add a node for each row
        $sommet = $table[$i];

        echo "    <", $name, ">\n";
        foreach ($etiquettes as $e) {
            echo "      <", $e, ">", $sommet[$e], "</", $e, ">\n";
        }
        echo "    </", $name, ">\n";
    }
}

function generate_xmldtd_header()
{
    header('Content-Type: text/xml');
    echo "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
    echo "<!DOCTYPE challenge [\n";
    echo "<!ELEMENT challenge (sommet*, massif*, pilote*, volrando*)>\n";
    echo "<!ELEMENT sommet   (sid, nom, mid, altitude, points, annee, commentaire)>\n";
    echo "<!ELEMENT massif   (mid, nom)>\n";
    echo "<!ELEMENT pilote   (pid, nom, prenom, pseudo)>\n";
    echo "<!ELEMENT volrando (vid, sid, pid, date, biplace, but, carbonne, commentaire)>\n";
    echo "<!ELEMENT sid          (#PCDATA)>\n";
    echo "<!ELEMENT mid          (#PCDATA)>\n";
    echo "<!ELEMENT pid          (#PCDATA)>\n";
    echo "<!ELEMENT vid          (#PCDATA)>\n";
    echo "<!ELEMENT nom          (#PCDATA)>\n";
    echo "<!ELEMENT altitude     (#PCDATA)>\n";
    echo "<!ELEMENT points       (#PCDATA)>\n";
    echo "<!ELEMENT annee        (#PCDATA)>\n";
    echo "<!ELEMENT commentaire  (#PCDATA)>\n";
    echo "<!ELEMENT prenom       (#PCDATA)>\n";
    echo "<!ELEMENT pseudo       (#PCDATA)>\n";
    echo "<!ELEMENT but          (#PCDATA)>\n";
    echo "<!ELEMENT biplace      (#PCDATA)>\n";
    echo "<!ELEMENT carbonne     (#PCDATA)>\n";
    echo "]>\n\n";
}

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    // En-tete du XML
    generate_xmldtd_header();

    echo "<challenge>\n";

    // Recuperation des sommets
    $etiquettes = array('sid', 'nom', 'mid', 'altitude',
                        'points', 'annee', 'commentaire');
    get_and_convert($dbh, 'SELECT * FROM sommets', 'sommet', $etiquettes);


    // Recuperation des massifs
    $etiquettes = array('mid', 'nom');
    get_and_convert($dbh, 'SELECT * FROM massifs', 'massif', $etiquettes);

    // Recuperation des pilotes
    $etiquettes = array('pid', 'nom', 'prenom', 'pseudo');
    get_and_convert($dbh, 'SELECT * FROM pilotes', 'pilote', $etiquettes);

    // Recuperation des volrandos
    $etiquettes = array('vid', 'sid', 'pid', 'date', 'biplace',
                        'but', 'carbonne', 'commentaire');
    get_and_convert($dbh, 'SELECT * FROM volrandos', 'volrando', $etiquettes);

    echo "</challenge>\n";

    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}


?>
