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
    init_pilotes_table(xmlDoc.getElementsByTagName("pilote"));
    init_volrandos_table(xmlDoc.getElementsByTagName("volrando"));

    // Comme l'entree 0 n'est pas utilise, un tableau a une taille + 1
    logs = "La table massifs contient   " + (tab_m.length - 1) + " massifs <br />" +
           "La table sommets contient   " + (tab_s.length - 1) + " sommets <br />" +
           "La table pilotes contient   " + (tab_p.length - 1) + " pilotes <br />" +
           "La table volrandos contient " + (tab_v.length - 1) + " volrandos <br />" +
           "<br />" + logs;

    document.getElementById('status').innerHTML= logs;
    
    document.getElementById('resultats').innerHTML = default_display();
}

function init_massifs_table(m)
{
    /*
     * La representation XML c'est:
     *
     *   m ---> massif 1  ---> 0: TEXT   x
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

        // le nom => massif.childNodes[3].childNodes[0].nodeValue;
        tab_m[mid] = new Array(massif.childNodes[3].childNodes[0].nodeValue,
                               new Array());
        //  NOTE: La liste des sommets sera remplie en parcourant la table
        // des sommets

        logs += "Massif " + tab_m[mid][0] + " ajoute dans la table <br />";
    }

    return true;
}

function init_pilotes_table(p)
{
    /*
     * La representation XML c'est:
     *
     *   p ---> pilote 1  ---> 0: TEXT   x
     *                    ---> 1: PID  --->  1
     *                    ---> 2: TEXT   x
     *                    ---> 3: NOM  --->  Guillaume
     *                    ---> 4: TEXT   x
     *                    ---> 5: PRENOM  --->  Thouvenin
     *                    ---> 6: TEXT   x
     *                    ---> 7: PSEUDO  --->  GTh
     *                    ---> 8: TEXT   x
     *     ---> pilote 2  ...
     *     ...
     *
     *  La table sera:
     *
     *    tab_p[PiloteID] = ["nom" => Guillaume,
     *                       "prenom" => Thouvenin,
     *                       "pseudo" => GTh,
     *                      ]
     */
    for (var i = 0; i < p.length; i++) {
        var pilote = p[i];
        var pid;

        // le sid est utilise comme index pour le stockage dans le table
        if ("pid" != pilote.childNodes[1].nodeName) {
            logs += "Erreur: PID not found <br />";
            return false;
        }

        pid = Number(pilote.childNodes[1].childNodes[0].nodeValue);
        tab_p[pid] = new Array();

        for (var j = 3; j < p[i].childNodes.length; j = j + 2) {

            if (pilote.childNodes[j].nodeName == 'nom') {
                tab_p[pid]["nom"] =
                    pilote.childNodes[j].childNodes[0].nodeValue;
            }
            else if (pilote.childNodes[j].nodeName == 'prenom') {
                tab_p[pid]["prenom"] =
                    pilote.childNodes[j].childNodes[0].nodeValue;
            }
            else if (pilote.childNodes[j].nodeName == 'pseudo') {
                tab_p[pid]["altitude"] =
                    pilote.childNodes[j].childNodes[0].nodeValue;
            }
            else {
                logs += "Erreur: Champs " +
                       pilote.childNodes[j].nodeName +
                       " inconnu dans pilote <br />";
                return false;
            }
        }
    }


    return true;
}

function init_volrandos_table(v)
{
    /*
     * La representation XML c'est:
     *
     *   v ---> volrando 1  ---> 0: TEXT   x
     *                      ---> 1: VID  --->  Vol ID
     *                      ---> 2: TEXT   x
     *                      ---> 3: SID  --->  Sommet ID
     *                      ---> 4: TEXT   x
     *                      ---> 5: PID  --->  Pilote ID
     *                      ---> 6: TEXT   x
     *                      ---> 7: DATE  --->  11/11/11
     *                      ---> 8: TEXT   x
     *                      ...
     *     ---> volrando 2  ...
     *     ...
     *
     *  La table sera:
     *
     *    tab_v[VolrandoID] = ["vid" => Vol ID,
     *                         "sid" => Sommet ID,
     *                         "pid" => Pilote ID,
     *                         ...
     *                        ]
     */
    for (var i = 0; i < v.length; i++) {
        var volrando = v[i];
        var vid;

        // le vid est utilise comme index pour le stockage dans le table
        if ("vid" != volrando.childNodes[1].nodeName) {
            logs += "Erreur: VID not found <br />";
            return false;
        }

        vid = Number(volrando.childNodes[1].childNodes[0].nodeValue);
        tab_v[vid] = new Array();

        for (var j = 3; j < v[i].childNodes.length; j = j + 2) {

            if (volrando.childNodes[j].nodeName == 'sid') {
                tab_v[vid]["sid"] =
                    Number(volrando.childNodes[j].childNodes[0].nodeValue);
            }
            else if (volrando.childNodes[j].nodeName == 'pid') {
                tab_v[vid]["pid"] =
                    Number(volrando.childNodes[j].childNodes[0].nodeValue);
            }
            else if (volrando.childNodes[j].nodeName == 'date') {
                tab_v[vid]["date"] =
                    Number(volrando.childNodes[j].childNodes[0].nodeValue);
            }
            else if (volrando.childNodes[j].nodeName == 'biplace') {
                tab_v[vid]["biplace"] =
                    Number(volrando.childNodes[j].childNodes[0].nodeValue);
            }
            else if (volrando.childNodes[j].nodeName == 'but') {
                tab_v[vid]["but"] =
                    Number(volrando.childNodes[j].childNodes[0].nodeValue);
            }
            else if (volrando.childNodes[j].nodeName == 'carbone') {
                tab_v[vid]["carbone"] =
                    Number(volrando.childNodes[j].childNodes[0].nodeValue);
            }
            else if (volrando.childNodes[j].nodeName == 'commentaire') {
                // Un commentaire peut etre vide
                var c = volrando.childNodes[j].childNodes[0];
                if (c) {
                    tab_v[vid]["commentaire"] = c.nodeValue;
                } else {
                    tab_v[vid]["commentaire"] = "";
                }
            }
            else {
                logs += "Erreur: Champs " +
                       volrando.childNodes[j].nodeName +
                       " inconnu dans volrando <br />";
                return false;
            }
        }
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
                    Number(sommet.childNodes[j].childNodes[0].nodeValue);
                
            }
            else if (sommet.childNodes[j].nodeName == 'altitude') {
                tab_s[sid]["altitude"] =
                    Number(sommet.childNodes[j].childNodes[0].nodeValue);
            }
            else if (sommet.childNodes[j].nodeName == 'points') {
                tab_s[sid]["points"] =
                    Number(sommet.childNodes[j].childNodes[0].nodeValue);
            }
            else if (sommet.childNodes[j].nodeName == 'annee') {
                tab_s[sid]["annee"] =
                    Number(sommet.childNodes[j].childNodes[0].nodeValue);
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

        // Il reste a ajouter le nom du sommet dans la liste des sommets
        // du massif correspondant.
        tab_m[tab_s[sid]['mid']][1].push(tab_s[sid]['nom']);
    }

    return true;
}

/*
 * Fonction d'affichage par defaut. On affiche la tables des massifs et la
 * liste des sommets des massifs.
 */
function default_display()
{
    var affichage = "<b> Liste des sommets par massifs </b> <br />";

    for (var i = 1; i < tab_m.length; i++)
    {
        var liste_s;  // liste des sommets sous forme de tableau

        // Le nom du massif
        affichage += tab_m[i][0] + " <br />";

        liste_s = tab_m[i][1];  // liste des sommets sous forme de tableau
        liste_s.sort();
        for (var j = 0; j < liste_s.length; j++)
            affichage += " > " + liste_s[j] + "<br />";

    }

    return affichage;
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
