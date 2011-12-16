<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <title>Challenge VolRando 2012 CHVD</title>
    <link rel="stylesheet" href="challenge.css">
    <script src="fonctions_challenge.js" type="text/javascript"> </script>
</head>
<body>

<!--
La page est d�coup�e de la fa�on suivante:

           ----  ---------------------------------
 BANDEAU ->     |             div_haut
           ---- |---------------------------------
                |                |
 CONTENU ->     |   div_gauche   |   div_droite
                |                |
           ---- |---------------------------------
 PIED PAGE ->   |             div_bas
           ----  ---------------------------------

Dans la partie gauche on retrouvera la zone de saisies des vols ainsi
qu'une zone console pour les messages d'erreurs.

Dans la partie droite on affichera les r�sutlats
-->

<!-- *******************
            BANDEAU
     *******************-->
<div id="div_haut">

  <h1> Bienvenue au challenge VolRando 2012 du CHVD </h1>

  <p> le principe du challenge est de varier les vols randos en essayant de
  d&eacutecouvrir de nouveaux points d'envol. Les vols des autres peuvent
  donner des id&eacutees pour plus tard et renseigner sur la faisabilit&eacute.

  Toutes les d&eacuteclarations sont faites sur l'honneur. Si vous ne vous souvenez plus
  des r&egravegles concernant la validit&eacute d'un vol et son nombre de points,
  vous pouvez consultez le
  <a href="http://volbivouac.free.fr/challengeCHVD/reglement.html">r&egraveglement 2012</a>.
  </p>

  <p> Pour les choix (pas forcement justifi�s) techniques il y a le classique
  <a href="http://volbivouac.free.fr/challengeCHVD/README.html">README</a> qui
  fait le point sur l'�tat du d�veloppement.

  <p> Une question, un commentaire, envoyez moi un mail: guillaume.thouvenin AT polymtl POINT ca <br />
  Une critique, envoyez moi un mail: cequoidejamonmail AT chezmoi POINT fr
  </p>

  <p>Bonnes randos et bons vols </p>

</div> <!-- Fin de div_haut -->


<!-- *******************
            CONTENU
     *******************-->
<div id="div_gauche">

  <h2> Zone de saisie des VolRandos </h2>

    <p> Si votre sommet n'apparait pas dans la liste, soumettez votre vol
	en choisissant l'option "Nouveau vol" (c'est l'option par d�fault. De
	la m�me fa�on si vous n'apparaissez pas dans la liste des pilotes, vous
	pouvez vous cr�er un profil en laissant l'option par d�faut "Nouveau pilote".
    </p>

    <p id="saisie">
      <form id="saisieVolrando">
        <table class="invisible">

        <tr> <!-- Choix du massif -->
            <?php
                $dbh = new PDO('sqlite:challengeCHVD.sqlite3');
                $result = $dbh->query('SELECT * FROM massifs');

                echo '<td class="invisible"> Choix du massif </td>';
                echo '<td class="invisible">';
                echo '<select name="massif">';
                echo '<option> Nouveau Massif </option>';
                foreach ($result as $massif) {
                    echo '<option>', $massif['nom'], '</option>';
                }
                echo '</select>';
                echo '</td>';

            ?>
        </tr>

        <tr>
          <td class="invisible"> Sommets </td>
          <td class="invisible">
            <select name="sommet">
            <option value="0">Nouveau sommet</option>
            <option value="1">Chartreuse - Dent de Crolles</option>
            <option value="2">Chartreuse - La Grande Sure</option>
            <option value="3">Belledonne - Le Jas du lievre</option>
            <option value="4">Vercors - Le belevedere</option>
            </select>
          </td>
        </tr>

        <tr> <!-- Choix du pilote -->
          <td class="invisible"> Pilote </td>
          <td class="invisible">
            <select name="pilote">
            <option value="O">Nouveau pilote</option>
            <option value="1">Guillaume</option>
            <option value="2">MisterX</option>
            <option value="3">Toto</option>
            </select>
          </td>
        </tr>

        <!-- Choix de la date -->
        <tr>
          <td class="invisible"> Date (JJ/MM/YY) </td>
          <td class="invisible"> <input type="text" name="datevol" id="datevol"> </td>
        </tr>
        </table>

        <!-- Bonus biplace -->
        <input type="checkbox" name="biplace" />
        Vol effectu� en biplace (1 point de bonus)<br />

        <!-- Info sur mobilite douce -->
        <input type="checkbox" name="mobilitedouce" />
        Vol effectu� en mobilit� dite douce (c'est � titre indicatif)<br />

		<br />
        Un commentaire sur le vol <br />
        (sur une seule ligne mais qui peut �tre longue) <br />
        <input type="text" size=40 name="commentaire" />
        <br />

        <input type="button" value="Soumettre votre volrando" onclick="check_volrando()">
      </form>
    </p>

    <h2> Console </h2>
      <p id="status">
      En attente de la d�claration d'un vol...
      </p> <!-- Fin de status -->

</div> <!-- Fin de div_gauche -->

<div id="div_droite">

  <h2> Affichage des r�sultats </h2>

    <p id="resultats">
    <!--
        Au chargement de la page, on recupere les tables dans la base de donnees
        et on affiche directement le tableau des resultats. Ensuite les mises a jour
        viendront ecraser cette zone en utilisant l'id "resultat".
    -->
    <script type="text/javascript">
        ask_to_server('sommets');
    </script>

    </p>

</div> <!-- Fin de div_droite -->

<!-- *******************
          PIEDPAGE
     *******************-->
<div id="div_bas">
  <p> Pas de copyright, pompez, diffusez, faite bien ce que vous voulez avec le code qui est
  <a href=https://github.com/gthouvenin/challengeCHVD>dispo sur github</a>.
  </p>
</div> <!-- Fin de div_bas -->

</body>
</html>
