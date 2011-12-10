<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <title>Challenge VolRando 2012 CHVD</title>
    <link rel="stylesheet" href="challenge.css">
</head>
<body>

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

    // et c'est tout
    $db = NULL;
}
catch (PDOException $e) {
    echo 'Erreur: ' , $e->getMessage() , '<br />';
}
?>
<!--
La page est découpée de la façon suivante:

Note CSS: Les zone de saisie et de status font parties de la zone
          dite "gauche". 
          
           ----  -------------------------------------
 BANDEAU ->     |            message d'intro
                | 
                |
           ---- |-------------------------------------
                |                |
                | Zone de saisie | 
 CONTENU ->     |                |    resultats
                |                |
                |----------------|
                | Zone de status |
           ---- |-------------------------------------
 PIED PAGE ->   | Remerciements et autres blah blah
           ----  -------------------------------------
-->
  
<!-- *******************
            BANDEAU 
     *******************-->
<div id="bandeau"> 

  <h1> Bienvenue au challenge VolRando 2012 du CHVD </h1>

  <p> le principe du challenge est de varier les vols randos en essayant de
  d&eacutecouvrir de nouveaux points d'envol. Les vols des autres peuvent
  donner des id&eacutees pour plus tard et renseigner sur la faisabilit&eacute.

  Toutes les d&eacuteclarations sont faites sur l'honneur. Si vous ne vous souvenez plus
  des r&egravegles concernant la validit&eacute d'un vol et son nombre de points,
  vous pouvez consultez le 
  <a href="http://volbivouac.free.fr/challengeCHVD/reglement.html">r&egraveglement 2012</a>.
  </p>

  <p> Pour les choix (pas forcement justifiés) techniques il y a le classique
  <a href="http://volbivouac.free.fr/challengeCHVD/README.html">README</a> qui
  fait le point sur l'état du développement.

  <p> Une question, un commentaire, envoyez moi un mail: guillaume.thouvenin AT polymtl POINT ca <br />
  Une critique, envoyez moi un mail: cequoidejamonmail AT chezmoi POINT fr
  </p>

  <p>Bonnes randos et bons vols </p>

</div>


<!-- *******************
            CONTENU 
     *******************-->
<div id="contenu">

  <div id="gauche">

    <div id="saisie">
      <h2> Zone de saisie des VolRandos </h2>

      <form Method="POST" Action="index.php">
        <table id="invisible">
        <tr> <!-- Choix du sommet -->
          <td id="invisible"> Sommets </td>
          <td id="invisible">
            <select name="sommet">
            <option value="">Choisir un sommet dans la liste</option>
            <option value="">-------------------------</option>
            <option value="0">ou declarer un nouveau sommet</option>
            <option value="">-------------------------</option>
            <option value="1">Chartreuse - Dent de Crolles</option>
            <option value="2">Chartreuse - La Grande Sure</option>
            <option value="3">Belledonne - Le Jas du lievre</option>
            <option value="4">Vercors - Le belevedere</option>
            </select>
          </td>
        </tr>

        <tr> <!-- Choix du pilote -->
          <td id="invisible"> Pilote </td>   
          <td id="invisible">        
            <select name="pilote">
            <option value="">Votre nom</option>
            <option value="">-------------------------</option>
            <option value="O">ou ajoutez un nouveau pilote</option>
            <option value="">-------------------------</option>
            <option value="1">Guillaume</option>
            <option value="2">Laurence</option>
            </select>
          </td>
        </tr>

        <tr> <!-- Choix de la date --> 
          <td id="invisible"> Date (JJ/MM/YY) </td>
          <td id="invisible"> <input type=text name=date  > </td>
        </tr>
        </table>

        <input type="checkbox" name="biplace" value="biplace" />
        Vol effectué en biplace (1 point de bonus)<br />
       
        <input type="checkbox" name="mobilitedouce" value="mobilitedouce" />
        Vol effectué en mobilité dite douce (c'est à titre indicatif)<br />

        Un commentaire sur le vol (sur une seule ligne)
        <input type="text" size=50 name="commentaire" />
        <br />
  
        <br />
        <input type=submit value="Soumettre votre volrando">
      </form>
    </div> <!-- Fin de saisie -->

    <div id="status">
      <h2> Console </h2>
      <?php
        $sommet        = $_POST['sommet'];
        $date          = $_POST['date'];
        $pilote        = $_POST['pilote'];
        $biplace       = $_POST['biplace'];
        $mobilitedouce = $_POST['mobilitedouce'];
        $commentaire   = $_POST['commentaire'];
        
        echo 'sommet        : ', $sommet, '<br />';
        echo 'date          : ', $date, '<br />';
        echo 'pilote        : ', $pilote, '<br />';
        echo 'biplace       : ', $biplace, '<br />';
        echo 'mobilitedouce : ', $mobilitedouce, '<br />';
        echo 'commentaire   : ', $commentaire, '<br />';
      ?>
      </p>
    </div> <!-- Fin de status -->

  </div> <!-- Fin de gauche -->

  <!-- Affichage des resultats -->

  <h2> Affichage des résultats </h2>

  <?php
    /* On afficher les sommets
     * OBJET: SOMMET
     * PROPRIETES:
     *   - SID       # Cle == sommet ID
     *   - NOM       # Text
     *   - MID       # massif ID
     *   - ALTITUDE  # INTEGER
     *   - POINTS    # INTEGER
     *   - ANNEE     # INTEGER
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
	echo '</tr>';

    foreach($table_sommets as $sommet) {
        echo '<tr>';
        for ($i=0; $i<6; $i++) {
            echo '  <td>', $sommet[$i],'</td>';
        }
        echo '</tr>';
    }
   	echo '</table>', "\n";
  ?>

</div> <!-- Fin de contenu -->

<!-- *******************
          PIEDPAGE 
     *******************-->
<div id="piedpage">
  <p> Pas de copyright, pompez, diffusez, faite bien ce que vous voulez avec le code qui est dispo sur
  github...bientôt.
  </p>
</div>

</body>
</html>
