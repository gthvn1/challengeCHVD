/*
 * On recupere nos quatre tables sous forme de chaine JSON
 * pour pouvoir les manipuler cote client.
 * On recupere ces valeurs des le chargement de la page. On
 * les mettra a jour si on modifie une table.
 */

// Les variables globales
logs = "Pas de logs";

/*
 * La table des sommets est indexee par les SID. L'entree 0 n'est donc
 * pas utilise.
 * Pour la table des massifs, nous rajoutons un champ qui contiendra la
 * liste des sommets associes pour faciliter l'logs dans les choix
 * de saisie.
 */
tab_s = new Array;  // tableau des sommets
tab_m = new Array;  // tableau des massifs
tab_p = new Array;  // tableau des pilotes
tab_v = new Array;  // tableau des volrandos

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
    // On initialise les logs
    logs = "";
    /*
     * On initialise la table des massifs en premier car nous aurons allons
     * ensuite ajouter une liste de sommet associe au massif. Il faut donc
     * que les massifs soient connus au moment d'initialiser les sommets
     */
    init_massifs_table(xmlDoc.getElementsByTagName("massif"));
    init_sommets_table(xmlDoc.getElementsByTagName("sommet"));
    // Comme l'entree 0 n'est pas utilise, un tableau a une taille + 1
    var infos = "La table massifs contient " + (tab_m.length - 1) + " massifs <br />" +
                "La table sommets contient " + (tab_s.length - 1) + " sommets <br />";

    document.getElementById('status').innerHTML= logs;
    document.getElementById('resultats').innerHTML= infos;
}

function init_massifs_table(m)
{
    /*
     * La representation XML c'est:
     *
     *   s ---> massif 1  ---> 0: TEXT   x
     *                    ---> 1: MID  --->  1
     *                    ---> 2: TEXT   x
     *                    ---> 3: NOM  --->  Chartreuse
     *                    ---> 4: TEXT   x
     *     ---> massif 2  ...
     *     ...
     *  La table sera:
     *
     *    tab_m[MassifID][0] = ["nom"]
     *    tab_m[MassifID][1] = ["nom sommet1", "nom sommet2", ...]
     *
     *  La liste des sommets sera remplie en parcourant la table
     *  des sommets
     */
    for (var i = 0; i < m.length; i++) {
        var massif = m[i];
        var mid;

        // le sid est utilise comme index pour le stockage dans le table
        if ("mid" != massif.childNodes[1].nodeName) {
            logs += "Erreur: MID not found <br />";
            return false;
        }

        mid = Number(massif.childNodes[1].childNodes[0].nodeValue);
        tab_m[mid] = new Array();

        // On met le nom directement
        tab_m[mid][0] = massif.childNodes[3].childNodes[0].nodeValue;
        logs += "Massif " + tab_m[mid][0] + " ajoute dans la table <br />";
    }

    return true;
}

function init_sommets_table(s)
{
    /*
     * La representation XML c'est:
     *
     *   s ---> Sommet 1  ---> 0: TEXT   x
     *                    ---> 1: SID  --->  1
     *                    ---> 2: TEXT   x
     *                    ---> 3: NOM  --->  Dent de Crolles
     *                    ---> 4: TEXT   x
     *                    ---> 5: MID
     *                    ---> 6: TEXT   x
     *                    ---> 8: ALTITUDE
     *                    ---> TEXT   x
     *                    ---> 7: COMMENTAIRE
     *                    ---> TEXT   x
     *                    ---> 7: COMMENTAIRE
     *                    ---> TEXT   x
     *     ---> Sommet 2
     *     ...
     *     ---> Sommet 101
     *
     *  La table sera:
     *
     *    tab_s[SommetID] = ["nom" => nomDuSommet,
     *                       "mid" => massif ID,
     *                       "altitude" => altitude du sommet,
     *                       ...
     *                       ]
     */
    for (var i = 0; i < s.length; i++) {
        var sommet = s[i];
        var sid;

        // le sid est utilise comme index pour le stockage dans le table
        if ("sid" != sommet.childNodes[1].nodeName) {
            logs += "Erreur: SID not found <br />";
            return false;
        }

        sid = Number(sommet.childNodes[1].childNodes[0].nodeValue);
        tab_s[sid] = new Array();

        for (var j = 3; j < s[i].childNodes.length; j = j + 2) {

            if (sommet.childNodes[j].nodeName == 'nom') {
                tab_s[sid]["nom"] =
                    sommet.childNodes[j].childNodes[0].nodeValue;
            }
            else if (sommet.childNodes[j].nodeName == 'mid') {
                tab_s[sid]["mid"] =
                    sommet.childNodes[j].childNodes[0].nodeValue;
            }
            else if (sommet.childNodes[j].nodeName == 'altitude') {
                tab_s[sid]["altitude"] =
                    sommet.childNodes[j].childNodes[0].nodeValue;
            }
            else if (sommet.childNodes[j].nodeName == 'points') {
                tab_s[sid]["points"] =
                    sommet.childNodes[j].childNodes[0].nodeValue;
            }
            else if (sommet.childNodes[j].nodeName == 'annee') {
                tab_s[sid]["annee"] =
                    sommet.childNodes[j].childNodes[0].nodeValue;
            }
            else if (sommet.childNodes[j].nodeName == 'commentaire') {
                // Un commentaire peut etre vide
                var c = sommet.childNodes[j].childNodes[0];
                if (c) {
                    tab_s[sid]["commentaire"] = c.nodeValue;
                } else {
                    tab_s[sid]["commentaire"] = "";
                }
            }
            else {
                logs += "Erreur: Champs " +
                       sommet.childNodes[j].nodeName +
                       " inconnu dans sommet <br />";
                return false;
            }
        }
    }

    return true;
}

// Ancienne fonction d'affichage. A remplacer par un parcours de tableau
function XXX_sommets_table(s)
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
    logs = "<table>";
    logs += "<tr>";
    logs += "<th>Nom du sommet</th>";
    logs += "<th>Massif ID</th>";
    logs += "<th>Altitude</th>";
    logs += "<th>Points</th>";
    logs += "<th>Annee</th>";
    logs += "<th>Commentaire</th>";
    logs += "</tr>";

    for (var i = 0; i < s.length; i++)
    {
        var sommet = s[i];
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
        logs += "<tr>";
        for (var j = 1; j < s[i].childNodes.length; j = j + 2) {

            // le sid sera utilise pour le stockage dans le table donc pour l'instant
            // on peut juste le skipper tant que la table n'est pas construite
            if (j == 1) continue;

            // On verifie le node type (1 => ELEMENT; 3 => TEXT_NODE)
            champs = sommet.childNodes[j];
            //logs += "&nbsp;&nbsp; nodeName: <b>" + champs.nodeName + "</b>";
            //logs += " nodeType: " + champs.nodeType;
            //logs += " nodeValue: " + champs.nodeValue ;
            //logs += " childNodes: " + champs.childNodes.length ;
            //logs += "<br />";

            // on va lire la valeur du champs nodeName:
            valeur = champs.childNodes[0];
            if (valeur) {
                //logs += "&nbsp;&nbsp;&nbsp;&nbsp; #"+ j +" nodeName: <b>" + valeur.nodeName + "</b>";
                //logs += " nodeType: " + valeur.nodeType;
                //logs += " nodeValue: <b>" + valeur.nodeValue + "</b>";
                logs += "<td>" + valeur.nodeValue + "</td>";
            } else {
                // commentaire vide
                logs += "<td>  </td>";
            }
            //logs += "<br />";
        }

        logs += "</tr>";
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
