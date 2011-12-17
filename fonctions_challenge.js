/********************************************************************
 * Les fonctions gmd_ sont les fonctions de Generation de Menus
 * Deroulants
 */

function gmd_pilotes()
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

function gmd_massifs()
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

function gmd_sommets()
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
                document.getElementById('zone_saisie_sommet').innerHTML = xhr.responseText;
            } else {
                alert('Error choix sommet: status =' + xhr.status);
            }
        }
    }

    // true => mode de transfert asynchrone
    var e =  document.getElementById("choix_massif_id");
    xhr.open("GET","server_queries.php?param=select_sommets&massif=" + e.selectedIndex, true);
    xhr.send();
}


/********************************************************************
 *
 * Fonctions d'envoie des requetes d'affichage des resultats au
 * serveur
 */

function ask_to_server(arg)
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
function check_volrando()
{
    var x = document.getElementById("formulaire_volrando"),
        monTexte = "  <b> VERIFICATION DU VOL </b> <br />";

    // x contient tous les elements dans la FORM
    var e_massif   = x.elements["choix_massif_name"],
        e_sommet   = x.elements["choix_sommet_name"],
        e_pilote   = x.elements["choix_pilote_name"],
        e_datevol  = x.elements["choix_date_name"],
        e_biplace  = x.elements["choix_biplace_name"],
        e_mobdouce = x.elements["choix_mobilitedouce_name"],
        e_comment  = x.elements["choix_commentaire_name"];
   
    // on recupere les index de selection pour les trois listes 
    var si_massif = e_massif.selectedIndex;
        si_sommet = e_sommet.selectedIndex;
        si_pilote = e_pilote.selectedIndex;

    monTexte = monTexte  +
        'Massif ID : ' + e_massif.options[si_massif].value + '<br />' +
        'Sommet ID : ' + e_sommet.options[si_sommet].value + '<br />' +
        'Pilote ID : ' + e_pilote.options[si_pilote].value + '<br />' +
        'Date vol : ' + e_datevol.value        + '<br />' +
        'Biplace : ' + e_biplace.checked      + '<br />' +
        'Mobilite douce : ' + e_mobdouce.checked     + '<br />' +
        'Commentaire : ' + e_comment.value        + '<br />';

    //alert(monTexte);
    document.getElementById('zone_status').innerHTML= monTexte;
}
