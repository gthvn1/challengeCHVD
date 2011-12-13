<?php

function ajout_donnees($doc, $root, $table, $name, $etiquettes)
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

try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    $qry = $dbh->prepare('SELECT * FROM sommets');
    $qry->execute();
    $table_sommets = $qry->fetchAll();

    $qry = $dbh->prepare('SELECT * FROM massifs');
    $qry->execute();
    $table_massifs = $qry->fetchAll();

    header('Content-Type: text/xml');
    echo "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
    echo "<root>\n";

    echo "  <sommets>\n";
    $etiquettes = array('sid', 'nom', 'mid', 'altitude',
                        'points', 'annee', 'commentaire');
    ajout_donnees($doc, $sommets_racine, $table_sommets,
                  'sommet', $etiquettes);
    echo "  </sommets>\n";


    echo "  <massifs>\n";
    $etiquettes = array('mid', 'nom');
    ajout_donnees($doc, $massifs_racine, $table_massifs,
                  'massif', $etiquettes);
    echo "  </massifs>\n";

    echo "</root>\n";

    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}


?>
