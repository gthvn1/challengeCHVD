
<!-- On commence par recuperer les quatre tables qui nous serviront
     pour les differents affichages. Pour le traitement des differents
     ajouts ou des differents tri nous utiliserons AJAX.
-->
<?php
//open database file
try {
    $db = new PDO('sqlite:challengeCHVD.sqlite3');
    $qry = $db->prepare('SELECT * FROM sommets');
    if ($qry->execute() == 1) {
        $table_sommets = $qry->fetchAll();
    } else {
        echo "TABLE DES SOMMETS: ERROR";
    }

    /* On afficher les sommets
     * OBJET: SOMMET
     * PROPRIETES:
     *   - SID         # Cle == sommet ID
     *   - NOM         # Text
     *   - MID         # massif ID
     *   - ALTITUDE    # INTEGER
     *   - POINTS      # INTEGER
     *   - ANNEE       # INTEGER
     *   - COMMENTAIRE # INTEGER
     */
    echo 'Taille de la tables des sommets: ', count($table_sommets);
    echo '<table>';
    echo '<tr>';
	echo '  <th> SID </th>';
	echo '  <th> NOM </th>';
    echo '  <th> MID </th>';
    echo '  <th> ALTITUDE </th>';
    echo '  <th> POINTS </th>';
    echo '  <th> ANNEE </th>';
    echo '  <th> COMMENTAIRE </th>';
	echo '</tr>';

    foreach($table_sommets as $sommet) {
        echo '<tr>';
        for ($i=0; $i<7; $i++) {
            echo '  <td>', $sommet[$i],'</td>';
        }
        echo '</tr>';
    }
   	echo '</table>', "\n";
    
    // et c'est tout
    $db = NULL;
}
catch (PDOException $e) {
    echo 'Erreur: ' , $e->getMessage() , '<br />';
}
  ?>
