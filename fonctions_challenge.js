/********************************************************************
 * Fonction qui créer l'objet XmlHttpRequest.
 */

function getXhr()
{
    var xhr = null;
    if(window.XMLHttpRequest) // Firefox et autres
        xhr = new XMLHttpRequest();
    else if(window.ActiveXObject) { // Internet Explorer
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    else { // XMLHttpRequest non supporté par le navigateur
        alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
        xhr = false;
    }
    return xhr
}

/********************************************************************
 * Les fonctions gmd_ sont les fonctions de Generation de Menus
 * Deroulants
 */

function gmd_pilotes()
{
    var xhr = getXhr();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4) {
            if ((xhr.status == 200 || xhr.status == 0)) {
                document.getElementById('zone_saisie_pilote').innerHTML = xhr.responseText;
            } else {
                alert('Error choix pilote: status =' + xhr.status);
            }
        }
    }

    // true => mode de transfert asynchrone
    xhr.open("GET","server_queries.php?param=select_pilotes", true);
    xhr.send();
}

/*
 * La fonction gmd_massifs est appelee lors du chargement de la page
 * web. Elle sera egalement appelee lorsqu'un nouveau vol sera ajoute
 * dans la base de donnee.
 */
function gmd_massifs()
{
    var xhr = getXhr();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4) {
            if ((xhr.status == 200 || xhr.status == 0)) {
                document.getElementById('zone_saisie_massif').innerHTML = xhr.responseText;
            } else {
                alert('Error choix massif: status =' + xhr.status);
            }
        }
    }

    // true => mode de transfert asynchrone
    xhr.open("GET","server_queries.php?param=select_massifs", true);
    xhr.send();
}

/*
 * Cette fonction est appelee lorsqu'un massif a ete selectionne. Si le massif est
 * "nouveau" (c'est a dire avec un mid == 0) il va falloir creer deux nouvelles zones
 * de texte pour pouvoir saisir les noms du nouveau massif et du nouveau sommet.
 */
function gmd_sommets()
{
    var xhr = getXhr();
    var e =  document.getElementById("choix_massif_id");
    var mid = e.options[e.selectedIndex].value;

    if (mid == 0) {
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4) {
                if ((xhr.status == 200 || xhr.status == 0)) {
                    document.getElementById('zone_saisie_nouveau_massif').innerHTML = xhr.responseText;
                } else {
                    alert('Error choix sommet: status =' + xhr.status);
                }
            }
        }

        // true => mode de transfert asynchrone
        xhr.open("GET","server_queries.php?param=text_nouveau_massif", true);
        xhr.send();
    } else {
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4) {
                if ((xhr.status == 200 || xhr.status == 0)) {
                    document.getElementById('zone_saisie_sommet').innerHTML = xhr.responseText;
                } else {
                    alert('Error choix sommet: status =' + xhr.status);
                }
            }
        }

        // true => mode de transfert asynchrone
        xhr.open("GET","server_queries.php?param=select_sommets&massif=" + mid, true);
        xhr.send();
    }
}

/*
 * Cette fonction est appelee lorsqu'un sommet a ete choisi dans la liste. On va alors
 * verifier si le sommet est nouveau. Si c'est le cas on ajoute une zone de texte pour
 * saisir le nouveau sommet. Sinon on a rien a faire.
 */
function check_nouveau_sommet()
{
    var e =  document.getElementById("choix_sommet_id");
    var sid = e.options[e.selectedIndex].value;

    if (sid == 0) {
        var xhr = getXhr();

        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4) {
                if ((xhr.status == 200 || xhr.status == 0)) {
                    document.getElementById('zone_saisie_nouveau_sommet').innerHTML = 
                        xhr.responseText;
                } else {
                    alert('Error choix nouveau sommet: status =' + xhr.status);
                }
            }
        }

        // true => mode de transfert asynchrone
        xhr.open("GET","server_queries.php?param=text_nouveau_sommet", true);
        xhr.send();
    }
}

/********************************************************************
 * Fonctions d'envoie des requetes d'affichage des resultats au
 * serveur
 */

function ask_to_server(arg)
{
    var xhr = getXhr();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4) {
            if ((xhr.status == 200 || xhr.status == 0)) {
                document.getElementById('zone_resultats').innerHTML = xhr.responseText;
            } else {
                alert('Error: status =' + xhr.status);
            }
        }
    }

    // true => mode de transfert asynchrone
    xhr.open("GET","server_queries.php?param=" + arg, true);
    xhr.send();
}

/********************************************************************
 *
 * Fonction de validation des champs du volrando declare
 *
 * Cette fonction permet de valider un minimum les donnees passees
 * en parametre du vol rando avant d'envoyer la requete d'ajout
 * dans la base de donnee au serveur
 */
function check_number(n)
{
    if (isNaN(n) || n == 0)
        return false;
    else
        return true;
}

// on verifie seulement si la string n'est pas vide
function check_date(d)
{
    if (d)
        return true;
    else
        return false;
}

function check_volrando()
{
    var x = document.getElementById("formulaire_volrando"),
        volvalide, monTexte;

    // x contient tous les elements dans la FORM
    var e_massif            = x.elements["choix_massif_name"],
        e_nouveau_massif    = x.elements["choix_nouveau_massif_name"],
        e_sommet            = x.elements["choix_sommet_name"],
        e_nouveau_sommet    = x.elements["choix_nouveau_sommet_name"],
        e_pilote            = x.elements["choix_pilote_name"],
        e_datevol           = x.elements["choix_date_name"],
        e_biplace           = x.elements["choix_biplace_name"],
        e_mobdouce          = x.elements["choix_mobilitedouce_name"],
        e_comment           = x.elements["choix_commentaire_name"];

    // on recupere les index de selection pour les trois listes
    var si_massif = e_massif.selectedIndex,
        si_sommet = e_sommet.selectedIndex,
        si_pilote = e_pilote.selectedIndex;

    // et maintenant on peut recuperer les valeurs
    var mid = Number(e_massif.options[si_massif].value),
        sid = Number(e_massif.options[si_sommet].value),
        pid = Number(e_massif.options[si_pilote].value),
        datevol = e_datevol.value,
        biplace = (e_biplace.checked)  ? 1 : 0,
        mobdouce = (e_mobdouce.checked) ? 1 : 0,
        comment = e_comment.value;

    if (check_number(mid) && check_number(sid) && check_number(pid) && check_date(datevol)) {
        monTexte = ' <p> VOTRE VOL A ETE VALIDE </p>';
        volvalide = true;
    } else {
        monTexte = ' <p class="invalide"> VOTRE VOL EST INVALIDE </p>';
        volvalide = false;
    }

    if (check_number(mid))
        monTexte += '<p> Massif ID #' + mid + ' : OK  </p>';
    else
        monTexte += '<p class="invalide"> Massif ID #' + mid + ' : KO </p>';

    if (check_number(sid))
        monTexte += '<p> Sommet ID #' + sid + ' : OK  </p>';
    else
        monTexte += '<p class="invalide"> Sommet ID #' + sid + ' : KO </p>';

    if (e_nouveau_sommet)
        monTexte += '<p> Nouveau sommet => ' + e_nouveau_sommet.value+ ' </p>';
    else
        monTexte += '<p> Pas de nouveau sommet </p>';

    if (check_number(pid))
        monTexte += '<p> Pilot ID #' + pid + ' : OK  </p>';
    else
        monTexte += '<p class="invalide"> Pilot ID #' + pid + ' : KO </p>';

    if (check_date(datevol))
        monTexte += '<p> Date' + datevol + ' : OK </p>';
    else
        monTexte += '<p class="invalide"> Date ' + datevol + ' : KO </p>';

    monTexte = monTexte  +
        '<p> Biplace : '   + biplace + '</p>' +
        '<p> Mobilite douce : ' + mobdouce + '</p>' +
        '<p> Commentaire : ' + comment + '</p>';

    //alert(monTexte);
    document.getElementById('zone_status').innerHTML= monTexte;
}
