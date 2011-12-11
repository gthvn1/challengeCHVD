<?php

function lire_table($db, $requete)
{
    $qry = $db->prepare($requete);
    $qry->execute();
    return $qry->fetchAll();
}

//open database file
try {
    $db = new PDO('sqlite:challengeCHVD.sqlite3');

    $table_sommets   = lire_table($db, 'SELECT * FROM sommets');
    $table_massifs   = lire_table($db, 'SELECT * FROM massifs');
    $table_pilotes   = lire_table($db, 'SELECT * FROM pilotes');
    $table_volrandos = lire_table($db, 'SELECT * FROM volrandos');

    $tables = array(
        "sommets"   => $table_sommets,
        "massifs"   => $table_massifs,
        "pilotes"   => $table_pilotes,
        "volrandos" => $table_volrandos
    );

    //$fp = fopen('results.json', 'w');
    //fwrite($fp, json_encode($tables));
    //fclose($fp);
    
    echo json_encode($tables);

    // et c'est tout
    $db = NULL;
}
catch (PDOException $e) {
    echo 'Erreur: ' , $e->getMessage() , '<br />';
}

?>
