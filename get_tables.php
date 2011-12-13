<?php

function ajout_donnees($doc, $root, $table, $name, $etiquettes)
{
    $nbm = count($table);

    for ($i=0; $i < $nbm; $i++) {
        // Add a node for each row
        $sommet = $table[$i];

        $occ = $doc->createElement($name);
        $occ = $root->appendChild($occ);

        foreach ($etiquettes as $e) {
            $child = $doc->createElement($e);
            $child = $occ->appendChild($child);
            $value = $doc->createTextNode($sommet[$e]);
            $value = $child->appendChild($value);
        }
    }
}

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    //echo '<form action=""> ', "\n";
    //echo '<select name="sommets">', "\n";

    $qry = $dbh->prepare('SELECT * FROM sommets');
    $qry->execute();
    $table_sommets = $qry->fetchAll();

    $qry = $dbh->prepare('SELECT * FROM massifs');
    $qry->execute();
    $table_massifs = $qry->fetchAll();

    // Creation de la doc xml
    $doc = new DomDocument('1.0', 'iso-8859-1');

    // Create root node
    $root = $doc->createElement('root');
    $root = $doc->appendChild($root);

    // Ajout des sommets dans le XML
    $sommets_racine = $doc->createElement('sommets');
    $sommets_racine = $root->appendChild($sommets_racine);
    $etiquettes = array('sid', 'nom', 'mid', 'altitude', 'points', 'annee', 'commentaire');
    ajout_donnees($doc, $sommets_racine, $table_sommets, 'sommet', $etiquettes);

    // Ajout des massifs dans le XML
    $massifs_racine = $doc->createElement('massifs');
    $massifs_racine = $root->appendChild($massifs_racine);
    $etiquettes = array('mid', 'nom');
    ajout_donnees($doc, $massifs_racine, $table_massifs, 'massif', $etiquettes);

    // Ajouter le formatOutput si on veut voir la sortie
    //$doc->formatOutput = true;
    $doc->normalize();
    $xml_string = $doc->saveXML();

    echo $xml_string;
    $dbh = NULL;
} 
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}


?>
