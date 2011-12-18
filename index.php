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
La page est découpée de la façon suivante:

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

Dans la partie droite on affichera les résutlats
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

  <p> Pour les choix (pas forcement justifiés) techniques il y a le classique
  <a href="http://volbivouac.free.fr/challengeCHVD/README.html">README</a> qui
  fait le point sur l'état du développement.

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

    <p> Si votre massif ou votre sommet n'apparaissent pas dans la liste, n'hésitez
    pas à le faire découvrir en l'ajoutant dans la liste des sommets. Vous aurez un
    point de bonus. Pour cela utilisez la zone prévue à cette effet.
    </p>
    <p> Si vous n'êtes pas encore enregistré, votre nom n'appararîtera pas dans
    la liste. Choisissez "Nouveau Pilote" et entrer au moins un pseudo. C'est lui
    qui sera affiché dans le tableau des résultats.
    </p>

    <p id="saisie">
      <form id="formulaire_volrando">
        <table class="invisible">

          <tr id="zone_saisie_massif"> <!-- Choix du massif -->
            <script type="text/javascript">
                gmd_massifs();
            </script>
          </tr>
          
          <tr id="zone_saisie_sommet">
            <!-- la zone sera mise a jour lors du choix du massif -->
            <td class="invisible"> Choix du sommet </td>
            <td class="invisible">
                <select id="choix_sommet_id" disabled="disabled">
                <option value="0"> Choisir un massif </option> 
            </td>
          </tr>

          <tr id="zone_saisie_nouveau_massif">
            <td class="invisible"> Nouveau massif </td> 
            <td class="invisible">
                <input type="text" name="choix_nouveau_massif_name" />
            </td>
          </tr>

          <tr id="zone_saisie_nouveau_sommet">
            <td class="invisible"> Nouveau sommet </td> 
            <td class="invisible">
              <input type="text" name="choix_nouveau_sommet_name" />
            </td>
          </tr>

          <tr id="zone_saisie_sommet_altitude">
            <td class="invisible"> Altitude </td> 
            <td class="invisible">
              <input type="text" name="choix_sommet_altitude_name" />
            </td>
          </tr>

          <tr id="zone_saisie_sommet_points">
            <td class="invisible"> Points </td> 
            <td class="invisible">
              <input type="text" name="choix_sommet_points_name" />
            </td>
          </tr>

          <tr id="zone_saisie_sommet_commentaire">
            <td class="invisible"> Commentaire </td> 
            <td class="invisible">
              <input type="text" name="choix_sommet_commentaire_name" />
            </td>
          </tr>

          <tr id="zone_saisie_pilote"> <!-- Choix du pilote -->
            <script type="text/javascript">
              gmd_pilotes();
            </script>
          </tr>

          <tr id="zone_saisie_nouveau_pilote">
            <td class="invisible"> Nouveau pilote </td> 
            <td class="invisible">
              <input type="text" name="choix_nouveau_pilote_name" />
            </td>
          </tr>

          <tr> <!-- Choix de la date -->
            <td class="invisible"> Date (JJ/MM/YY) </td>
            <td class="invisible">
              <input type="text" name="choix_date_name">
            </td>
          </tr>
        </table>

        <!-- Bonus biplace -->
        <input type="checkbox" name="choix_biplace_name" />
        Vol effectué en biplace (1 point de bonus)<br />

        <!-- Info sur mobilite douce -->
        <input type="checkbox" name="choix_mobilitedouce_name" />
        Vol effectué en mobilité dite douce (c'est à titre indicatif)<br />

		<br />
        Un commentaire sur le vol <br />
        (sur une seule ligne mais qui peut être longue) <br />
        <input type="text" size=40 name="choix_commentaire_name" />
        <br />

        <input type="button" value="Soumettre votre volrando" onclick="check_volrando()">
      </form>
    </p>

    <h2> Console </h2>
      <p id="zone_status">
        En attente de la déclaration d'un vol...
      </p> <!-- Fin de status -->

</div> <!-- Fin de div_gauche -->

<div id="div_droite">

  <h2> Affichage des résultats </h2>

    <p id="zone_resultats">
    <!--
        Au chargement de la page, on recupere les tables dans la base de donnees
        et on affiche directement le tableau des resultats. Ensuite les mises a jour
        viendront ecraser cette zone en utilisant l'id "resultat".
    -->
    <script type="text/javascript">
        ask_to_server('volrandos');
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
