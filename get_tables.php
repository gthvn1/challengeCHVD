<?php

function get_table_sommet($db)
{
    $qry = $db->prepare('SELECT * FROM sommets');
    if ($qry->execute() == 1) {
        $table_sommets = $qry->fetchAll();
    } else {
        echo "TABLE DES SOMMETS: ERROR";
    }

    $fp = fopen('results.json', 'w');
    fwrite($fp, json_encode($table_sommets));
    fclose($fp);

    echo json_encode($table_sommets);

}

//open database file
try {
    $db = new PDO('sqlite:challengeCHVD.sqlite3');

    get_table_sommet($db);

    // et c'est tout
    $db = NULL;
}
catch (PDOException $e) {
    echo 'Erreur: ' , $e->getMessage() , '<br />';
}

?>
