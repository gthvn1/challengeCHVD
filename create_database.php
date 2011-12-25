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
 *   - S_ID        # Cle == sommet ID
 *   - S_NOM       # Text
 *   - S_MID       # massif ID
 *   - S_ALTI      # INTEGER altitude
 *   - S_PTS       # INTEGER points
 *   - S_ANNEE     # INTEGER
 *   - S_COMMENT   # TEXT
 *
 * OBJET: MASSIF
 *   - M_ID        # Cle == massif ID
 *   - M_NOM
 *
 * OBJET: PILOTE
 *   - P_ID        # Cle == pilote ID
 *   - P_PSEUDO    # TEXT
 *
 * OBJET: VOLRANDO
 *   - V_ID        # Cle == volrando ID
 *   - V_SID       # sommet ID
 *   - V_PID       # pilote ID
 *   - V_DATE      # INTEGER => utilisation des timestamps Unix
 *   - V_BI        # INTEGER => 0: solo, 1: biplace
 *   - V_BUT       # REAL    => 0.5 si un but au sommet
 *   - V_CO2       # INTEGER => 0: mobilite douce, 1: Emmission de CO2
 *   - V_COMMENT   # TEXT
 */

function ajouter_sommets($dbh) {
    /*
     * Rappel, le format du fichier csv est le suivant:
     * Massif, Nom du sommet, Altitude, Points, Annee, Commentaire
     *     => $line[0] = "Nom"
     *     => $line[1] = "Massif"
     *     => $line[2] = "Altitude"
     *     => $line[3] = "Points"
     *     => $line[4] = "Annee"
     *     => $line[5] = "Commentaire"
     *  et donc count($line) == 6
     */

    $filecsv = "./sommets_2011.csv";
    $esize = 6; // An entry has 6 elements
    
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
            $qry = $dbh->prepare('SELECT * FROM massifs WHERE m_nom = ?');
            if ($qry->execute(array($line[1]))) {
                $res = $qry->fetchAll();
                if (count($res) == 0) {
                    // nouveau massif
                    $nbmassifs ++;
                    $qry = $dbh->prepare('INSERT INTO massifs (m_nom) VALUES (?);');
                    if (!$qry->execute(array($line[1]))) {
                        echo "WARNING: insertion of ", $line[1], " into table failed \n";
                    }
                }  // else nothing to do

                // Maintenant on peut ajouter le nouveau sommet
                $qry = $dbh->prepare('SELECT * FROM massifs WHERE m_nom = ?');
                $qry->execute(array($line[1]));
                $massifID = $qry->fetch();
                
                $qry = $dbh->prepare('INSERT INTO sommets 
                                      (s_nom, s_mid, s_alti, s_pts, s_annee, s_comment)
                                      VALUES (?,?,?,?,?,?);');
                $qry->execute(array($line[0], $massifID[0], $line[2], $line[3], $line[4], $line[5]));

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

    $pilotes[0] = "Guillaume";
    $pilotes[1] = "MisterX";
    $pilotes[2] = "Latete";
    $nbpilotes = count($pilotes);

    for ($i = 0; $i < $nbpilotes; $i++) {
        $p = $pilotes[$i];
        $qry = $dbh->prepare('INSERT INTO pilotes (p_pseudo) VALUES (?);');
        $qry->execute(array($p));
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
                    s_id        INTEGER PRIMARY KEY,
                    s_nom       TEXT COLLATE NOCASE,
                    s_mid       INTEGER,
                    s_alti      INTEGER,
                    s_pts       INTEGER,
                    s_annee     INTEGER,
                    s_comment   TEXT)');

    $dbh->exec('CREATE TABLE IF NOT EXISTS massifs (
                    m_id    INTEGER PRIMARY KEY,
                    m_nom   TEXT COLLATE NOCASE)');

    $dbh->exec('CREATE TABLE IF NOT EXISTS pilotes (
                    p_id        INTEGER PRIMARY KEY,
                    p_pseudo    TEXT COLLATE NOCASE)');

    $dbh->exec('CREATE TABLE IF NOT EXISTS volrandos (
                    v_id        INTEGER PRIMARY KEY,
                    v_sid       INTEGER,
                    v_pid       INTEGER,
                    v_date      INTEGER,
                    v_bi        INTEGER,
                    v_but       REAL,
                    v_co2       INTEGER,
                    v_comment   TEXT)');

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
