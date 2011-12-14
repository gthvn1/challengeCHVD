/*
 * On recupere nos quatre tables sous forme de chaine JSON
 * pour pouvoir les manipuler cote client.
 * On recupere ces valeurs des le chargement de la page. On
 * les mettra a jour si on modifie une table.
 */

var affichage = "Empty";

function requete_ajax(callback)
{
    var xhr;

    if (window.XMLHttpRequest) {
        // Code for IE7+, firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Votre navigateur ne supporte pas XMLHTTPRequest");
        return;
    }

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4) {
            if ((xhr.status == 200 || xhr.status == 0)) {
                // On recupere les donnees sous forme de texte brut
                //callback(xhr.responseText);
                callback(xhr.responseXML);
            } else {
                alert('Error: status =' + xhr.status);
            }
        }
    }

    // true => mode de transfert asynchrone
    xhr.open("GET","generate_xml.php", true);
    xhr.send();
}

/*
 * Callback utilise pour traiter les donnees retournees lors du GET
 * de la requete AJAX.
 */
function get_tables(xmlDoc)
{
    init_sommets_table(xmlDoc.getElementsByTagName("sommet"));

    document.getElementById('status').innerHTML= "Les tables ont ete generees";
    document.getElementById('resultats').innerHTML= affichage;
}

function init_sommets_table(s)
{
    /*
     * La representation XML c'est:
     *
     *   s ---> Sommet 1  ---> TEXT   x
     *                    ---> SID  --->  1
     *                    ---> TEXT   x
     *                    ---> NOM  --->  Dent de Crolles  
     *                    ---> TEXT   x
     *                    ...
     *                    ---> COMMENTAIRE
     *                    ---> TEXT   x
     *     ---> Sommet 2
     *     ...
     *     ---> Sommet 101
     */  
    affichage = "<table>";
    affichage += "<tr>";
    affichage += "<th>Nom du sommet</th>";
    affichage += "<th>Massif ID</th>";
    affichage += "<th>Altitude</th>";
    affichage += "<th>Points</th>";
    affichage += "<th>Annee</th>";
    affichage += "<th>Commentaire</th>";
    affichage += "</tr>";

    for (var i = 0; i < s.length; i++)
    {
        sommet = s[i];
        // le premier enfant contient du texte pour sommet. On ne l'utilise pas
        // donc on peut le passer.
        // Ensuite on va avoir comme enfants:
        //   1 -> SID
        //   2 -> TEXT
        //   3 -> NOM
        //   4 -> TEXT
        //   5...
        // Les textes sont toujours nuls dans notre cas. Donc on va regarder un
        // enfants sur 2.
        //
        affichage += "<tr>";
        for (var j = 1; j < s[i].childNodes.length; j = j + 2) {

            // le sid sera utilise pour le stockage dans le table donc pour l'instant
            // on peut juste le skipper tant que la table n'est pas construite
            if (j == 1) continue;

            // On verifie le node type (1 => ELEMENT; 3 => TEXT_NODE)
            champs = sommet.childNodes[j];
            //affichage += "&nbsp;&nbsp; nodeName: <b>" + champs.nodeName + "</b>";
            //affichage += " nodeType: " + champs.nodeType;
            //affichage += " nodeValue: " + champs.nodeValue ;
            //affichage += " childNodes: " + champs.childNodes.length ;
            //affichage += "<br />";

            // on va lire la valeur du champs nodeName:
            valeur = champs.childNodes[0];
            if (valeur) {
                //affichage += "&nbsp;&nbsp;&nbsp;&nbsp; #"+ j +" nodeName: <b>" + valeur.nodeName + "</b>";
                //affichage += " nodeType: " + valeur.nodeType;
                //affichage += " nodeValue: <b>" + valeur.nodeValue + "</b>"; 
                affichage += "<td>" + valeur.nodeValue + "</td>";
            } else {
                // commentaire vide
                affichage += "<td>  </td>";
            }
            //affichage += "<br />";
        }
        
        affichage += "</tr>";
    }
}

/*
 * Cette fonction permet de valider un minimum les donnees passees
 * en parametre du vol rando avant d'envoyer la requete d'ajout
 * dans la base de donnee au serveur
 */
function check_volrando()
{
    var x = document.getElementById("saisieVolrando"),
        monTexte = "  <b> VERIFICATION DU VOL </b> <br />";

    // Il y a 7 elements:
    //  sommet, pilote, date, biplace, co2, commentaire et
    //  soumettre_le_volrando
    if (x.length != 7) {
        alert('Fatal Error');
        return false;
    }

    var sommet   = x.elements["sommet"],
        pilote   = x.elements["pilote"],
        datevol  = x.elements["datevol"],
        biplace  = x.elements["biplace"],
        mobdouce = x.elements["mobilitedouce"],
        comment  = x.elements["commentaire"];

    monTexte = monTexte  +
        sommet.name   + ' : ' + sommet.selectedIndex + '<br />' +
        pilote.name   + ' : ' + pilote.selectedIndex + '<br />' +
        datevol.name  + ' : ' + datevol.value        + '<br />' +
        biplace.name  + ' : ' + biplace.checked      + '<br />' +
        mobdouce.name + ' : ' + mobdouce.checked     + '<br />' +
        comment.name  + ' : ' + comment.value        + '<br />';

    //alert(monTexte);
    document.getElementById('status').innerHTML= monTexte;
}
