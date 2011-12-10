<?php
/* Creation d'une base de donnees a partir des sommets 2001
 * 
 * Le format du fichier csv est le suivant:
 *
 *   Nom du sommet, Massif, Altitude, Points, Annee
 * 
 * L'annee d'un sommet represente l'annee a laquelle il 
 * a ete declare pour le concours CHVD
 *
 * OBJET: SOMMET
 * PROPRIETES:
 *   - SID       # Cle == sommet ID
 *   - NOM       # Text
 *   - MID       # massif ID
 *   - ALTITUDE  # INTEGER
 *   - POINTS    # INTEGER
 *   - ANNEE     # INTEGER
 *
 * OBJET: MASSIF
 *   - MID       # Cle == massif ID
 *   - NOM
 *
 * OBJET: PILOTE
 *   - PID       # Cle == pilote ID
 *   - NOM       # TEXT
 *   - PRENOM    # TEXT
 *   - PSEUDO    # TEXT
 *
 * OBJET: VOLRANDO
 *   - VID       # Cle == volrando ID
 *   - SID       # sommet ID
 *   - PID       # pilote ID
 *   - DATE      # INTEGER => utilisation des timestamps Unix
 *   - BIPLACE   # INTEGER => 0: solo, 1: biplace
 *   - BUT       # REAL    => 0.5 si un but au sommet
 *   - CARBONE   # INTEGER => 0: mobilite douce, 1: Emmission de CO2
 *   - COMMENT   # TEXT
 */

function ajouter_sommets($dbh) {
    /*
     * Rappel, le format du fichier csv est le suivant:
     * Massif, Nom du sommet, Altitude, Points, Annee
     *     => $line[0] = "Nom"
     *     => $line[1] = "Massif"
     *     => $line[2] = "Altitude"
     *     => $line[3] = "Points"
     *     => $line[4] = "Annee"
     *  et donc count($line) == 5
     */

    $filecsv = "./sommets_2011.csv";
    $esize = 5; // An entry has 5 elements
    
    $fh = fopen($filecsv, "r");

    $i = 0;
    $nbsommets = 0;  // Number of summits added to the DB
    $nbmassifs = 0;  // Number of massifs added to the DB

    echo "Ajout des sommets et des massifs dans la base ";
    while ($line = fgetcsv($fh, 1024)) {
        if (!$line) {
            break; // Terminado
        }

        $i ++;
        if (count($line) != $esize) {
            echo "WARNING: line $i ignored (probably incorrectly formatted)\n";
        } else {
            /* On ajoute le massif si il n'existe pas deja
             * => verifie si l'entree existe
             *   si elle n'existe pas
             *       alors on insere le nouveau massif
             *       sinon rien a faire
             */
            $qry = $dbh->prepare('SELECT * FROM massifs WHERE nom = ?');
            if ($qry->execute(array($line[1]))) {
                $res = $qry->fetchAll();
                if (count($res) == 0) {
                    // nouveau massif
                    $nbmassifs ++;
                    $qry = $dbh->prepare('INSERT INTO massifs (nom) VALUES (?);');
                    if (!$qry->execute(array($line[1]))) {
                        echo "WARNING: insertion of ", $line[1], " into table failed \n";
                    }
                }  // else nothing to do

                // Maintenant on peut ajouter le nouveau sommet
                $qry = $dbh->prepare('SELECT * FROM massifs WHERE nom = ?');
                $qry->execute(array($line[1]));
                $massifID = $qry->fetch();
                
                $qry = $dbh->prepare('INSERT INTO sommets (nom, mid, altitude, points, annee) VALUES (?,?,?,?,?);');
                $qry->execute(array($line[0], $massifID[0], $line[2], $line[3], $line[4]));

                // sommet ajoute
                echo ".";
            } else {
                echo "WARNING: query on massif ", $line[1], " failed \n";
            }

            $nbsommets ++;
        }
    }
    echo " done\n"; 

    echo "Number of summits added to the database: $nbsommets/$i\n";
    echo "Number of massifs added to the database: $nbmassifs \n";
}

function ajouter_pilotes($dbh) {

    $pilotes[0] = array("Guillaume", "Thouvenin", "Guillaume");
    $pilotes[1] = array("Laurence", "Elliautou", "Loulou38");
    $nbpilotes = count($pilotes);

    for ($i = 0; $i < $nbpilotes; $i++) {
        $p = $pilotes[$i];
        $qry = $dbh->prepare('INSERT INTO pilotes (nom, prenom, pseudo) VALUES (?,?,?);');
        $qry->execute(array($p[0], $p[1], $p[2]));
    }

    echo "Number of pilots added to the database : $nbpilotes \n";
}

/*********************************
 *  MAIN 
 *********************************/

// Open the database
try {
    $dbh = new PDO('sqlite:challengeCHVD.sqlite3');

    // Create the four tables
    $dbh->exec('CREATE TABLE IF NOT EXISTS sommets (
                    sid INTEGER PRIMARY KEY,
                    nom TEXT,
                    mid INTEGER,
                    altitude INTEGER,
                    points INTEGER,
                    annee INTEGER);');
    $dbh->exec('CREATE TABLE IF NOT EXISTS massifs (
                    mid INTEGER PRIMARY KEY,
                    nom TEXT);');
    $dbh->exec('CREATE TABLE IF NOT EXISTS pilotes (
                    pid INTEGER PRIMARY KEY,
                    nom TEXT,
                    prenom TEXT,
                    pseudo TEXT);');
    $dbh->exec('CREATE TABLE IF NOT EXISTS volrandos (
                    vid INTEGER PRIMARY KEY,
                    sid INTEGER,
                    pid INTEGER,
                    date INTEGER,
                    biplace INTEGER,
                    but REAL,
                    carbone INTEGER,
                    comment TEXT);');

    ajouter_sommets($dbh); // la table massif est remplie egalement
    ajouter_pilotes($dbh);
    // les vols seront ajoutes plus tard via l'interface web

    // Disconnect
    $dbh = NULL;
}
catch (PDOException $err) {
    echo "Catch exception from create_database.php \n";
    echo "   ==> Message:", $err->getMessage(), "\n";
}
?>
