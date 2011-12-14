<?php

function ajout_donnees($doc, $table, $name, $etiquettes)
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

    // En-tete du XML
    header('Content-Type: text/xml');
    echo "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
    echo "<root>\n";

    // Recuperation de la table sommets et
    // generation du XML pour les sommets
    $qry = $dbh->prepare('SELECT * FROM sommets');
    $qry->execute();
    $table_sql = $qry->fetchAll();

    echo "  <sommets>\n";
    $etiquettes = array('sid', 'nom', 'mid', 'altitude',
                        'points', 'annee', 'commentaire');
    ajout_donnees($doc, $table_sql, 'sommet', $etiquettes);
    echo "  </sommets>\n";

    // Recuperation de la table massifs et
    // generation du XML pour les massifs
    $qry = $dbh->prepare('SELECT * FROM massifs');
    $qry->execute();
    $table_sql = $qry->fetchAll();

    echo "  <massifs>\n";
    $etiquettes = array('mid', 'nom');
    ajout_donnees($doc, $table_sql, 'massif', $etiquettes);
    echo "  </massifs>\n";

    // Recuperation de la table pilotes et
    // generation du XML pour les pilotes
    $qry = $dbh->prepare('SELECT * FROM pilotes');
    $qry->execute();
    $table_sql = $qry->fetchAll();

    echo "  <pilotes>\n";
    $etiquettes = array('pid', 'nom', 'prenom', 'pseudo');
    ajout_donnees($doc, $table_sql, 'pilote', $etiquettes);
    echo "  </pilotes>\n";

    // Recuperation de la table volrandos et
    // generation du XML pour les volrandos
    $qry = $dbh->prepare('SELECT * FROM volrandos');
    $qry->execute();
    $table_sql = $qry->fetchAll();

    echo "  <volrandos>\n";
    $etiquettes = array('vid', 'sid', 'pid', 'date', 'biplace',
                        'but', 'carbonne', 'commentaire');
    ajout_donnees($doc, $table_sql, 'volrando', $etiquettes);
    echo "  </volrandos>\n";

    echo "</root>\n";

    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}


?>
