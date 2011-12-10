<?php

function ajouter_volrando($db)
{
	global $massifID, $sommetID, $piloteID, $points, $date;

	echo '<p> Informations sur votre volrando: <br />', "\n";
	echo 'MASSIF : <i>',  $massif, '</i><br />', "\n";
	echo 'SOMMET : <i>',  $sommet, '</i><br />', "\n";
	echo 'PSEUDO : <i>',  $pseudo, '</i><br />', "\n";
	echo 'POINTS : <i>',  $points, '</i><br />', "\n";
	echo 'DATE   : <i>',  $date  , '</i><br />', "\n";
	echo '</p>';

	// Ajout de la donnee
	$qry = $db->prepare('INSERT INTO challenge (massif, sommet, points, pseudo, date)
		                                VALUES (?,?,?,?,?)');
	$qry->execute(array($massif, $sommet, $points, $pseudo, $date));

	echo '<p class="green"> Votre RandoVol a &eacutet&eacute ajout&eacute </p>';
}

function afficher_filtre_pseudo($db, $pseudo)
{
	echo '<h2> Liste des vols de ', $pseudo ,' </h2>', "\n";

	$qry = $db->prepare('SELECT * FROM challenge WHERE pseudo=?');
	$result = $qry->execute(array($pseudo));

	afficher_resultat($result);
}

function afficher_filtre_massif($db, $massif)
{
	echo '<h2> Liste des vols dans ', $massif ,' </h2>', "\n";

	$qry = $db->prepare('SELECT * FROM challenge WHERE massif=?');
	$result = $qry->execute(array($massif));

	afficher_resultat($result);
}

function afficher_vols($db)
{
	echo '<h2> Liste de tous les vols </h2>', "\n";

	// execute query
	$result = $db->query('SELECT * FROM challenge');
	afficher_resultat($result);
}

function afficher_resultat($result)
{
	// if rows exist
	echo '<table>', "\n";
	echo '<tr>', "\n";
	echo '  <th> Date   </th>', "\n";
	echo '  <th> Massif </th>', "\n";
	echo '  <th> Sommet </th>', "\n";
	echo '  <th> Pseudo </th>', "\n";
	echo '  <th> Points </th>', "\n";
	echo '</tr>', "\n";
	foreach ($result as $row) {
       	echo '<tr>', "\n";
       	echo '  <td> ', $row['date']  , '</td>', "\n";
       	echo '  <td> ', $row['massif'], '</td>', "\n";
       	echo '  <td> ', $row['sommet'], '</td>', "\n";
       	echo '  <td> ', $row['pseudo'], '</td>', "\n";
   		echo '  <td> ', $row['points'], '</td>', "\n";
       	echo '</tr>', "\n";
   	}
   	echo '</table>', "\n";
}
