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
 * Cette fonction est appelee lorsqu'un massif a ete selectionne. Il faut donc griser
 * la zone de saisie des nouveaux massifs.
 */
function gmd_sommets()
{
    var xhr = getXhr();
    var e =  document.getElementById("choix_massif_id");
    var mid = e.options[e.selectedIndex].value;


    document.getElementById('zone_saisie_nouveau_sommet').innerHTML =
        enable_saisie_nouveau_sommet(true);

    document.getElementById('zone_saisie_sommet_altitude').innerHTML =
        enable_saisie_sommet_altitude(true);

    document.getElementById('zone_saisie_sommet_points').innerHTML =
        enable_saisie_sommet_points(true);

    document.getElementById('zone_saisie_sommet_commentaire').innerHTML =
        enable_saisie_sommet_commentaire(true);

    if (mid == 0 ) {
        document.getElementById('zone_saisie_nouveau_massif').innerHTML =
            enable_saisie_nouveau_massif(true);

        document.getElementById('zone_saisie_sommet').innerHTML =
            disable_saisie_sommet(false);
    } else {
        document.getElementById('zone_saisie_nouveau_massif').innerHTML =
            enable_saisie_nouveau_massif(false);

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
 * Cette fonction est appelee lorsqu'un sommet a ete selectionne. Il faut donc griser
 * la zone de saisie des nouveaux sommets
 */
function sommet_selected()
{
    var e =  document.getElementById("choix_sommet_id");
    var sid = e.options[e.selectedIndex].value;


    // si sid != 0 on grise toutes les zones
    document.getElementById('zone_saisie_nouveau_sommet').innerHTML =
        enable_saisie_nouveau_sommet(sid == 0);

    document.getElementById('zone_saisie_sommet_altitude').innerHTML =
        enable_saisie_sommet_altitude(sid == 0);

    document.getElementById('zone_saisie_sommet_points').innerHTML =
        enable_saisie_sommet_points(sid == 0);

    document.getElementById('zone_saisie_sommet_commentaire').innerHTML =
        enable_saisie_sommet_commentaire(sid == 0);

    document.getElementById('zone_saisie_nouveau_massif').innerHTML =
        enable_saisie_nouveau_massif(false);
}

/*
 * Cette fonction est appelee lorsqu'un pilote a ete selectionne. Il faut donc griser
 * la zone de saisie du nouveau pilote.
 */
function pilote_selected()
{
    var e =  document.getElementById("choix_pilote_id");
    var pid = e.options[e.selectedIndex].value;


    // si pid != 0 on grise le nouveau pilote
    document.getElementById('zone_saisie_nouveau_pilote').innerHTML =
        enable_saisie_nouveau_pilote(pid == 0);
}

function disable_saisie_sommet()
{
    var text;

    text =  '<td class="invisible"> Choix du sommet </td>';
    text += '<td class="invisible">';
    text += '  <select id="choix_sommet_id" disabled="disabled">';
    text += '  <option> Choisir un massif </option>';
    text += '</td>';

    return text;
}

function enable_saisie_generique(titre, id, choix)
{
    var text;

    text = '<td class="invisible">' + titre + '</td>';
    text += '<td class="invisible">';
    if (choix) {
        text += '<input type="text" id="' + id + '" />';
    } else {
        text += '<input type="text" disabled="disabled">';
    }
    text += '</td>';

    return text;
}

function enable_saisie_nouveau_massif(choix)
{
    return enable_saisie_generique("Nouveau massif", "choix_nouveau_massif_id", choix);
}

function enable_saisie_nouveau_sommet(choix)
{
    return enable_saisie_generique("Nouveau sommet", "choix_nouveau_sommet_id", choix);
}

function enable_saisie_sommet_altitude(choix)
{
    return enable_saisie_generique("Altitude", "choix_sommet_altitude_id", choix);
}

function enable_saisie_sommet_points(choix)
{
    return enable_saisie_generique("Points", "choix_sommet_points_id", choix);
}

function enable_saisie_sommet_commentaire(choix)
{
    return enable_saisie_generique("Commentaire", "choix_sommet_commentaire_id", choix);
}

function enable_saisie_nouveau_pilote(choix)
{
    return enable_saisie_generique("Nouveau pilote", "choix_nouveau_pilote_id", choix);
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
 * dans la base de donnee au serveur ... ou pas.
 */
function check_number(n)
{
    if (isNaN(n) || n == 0)
        return false;
    else
        return true;
}

/*
 * Pour l'instant on retourne un tableau contenant le html et la validite
 * du vol.
 */
function check_massif()
{
    var x = document.getElementById("choix_massif_id");
    var mid = Number(x.options[x.selectedIndex].value);
    var res = new Array('', true);

    if (mid == 0) {
        // On verifie si il y a un nouveau massif de declare.
        var nm = document.getElementById("choix_nouveau_massif_id");

        // Verifie si c'est une string
        if (nm.value === "") {
            res[0] = '<p class="invalide"> Aucun massif declare </p>';
            res[1] = false;
        } else {
            res[0] = '<p> Nouveau Massif = ' + nm.value + '</p>';
        }
    } else {
        res[0] = '<p> Massif Id  = ' + mid + '</p>';
    }

    return res;
}

/*
 * TODO: il reste a verifier si l'altitude et les points sont valides
 */
function check_sommet()
{
    var x = document.getElementById("choix_sommet_id");
    var sid = Number(x.options[x.selectedIndex].value);
    var res = new Array('', true);

    if (sid == 0) {
        // On verifie si on a tous les elements pour notre nouveau sommet
        var altitude = document.getElementById("choix_sommet_altitude_id");
        var points   = document.getElementById("choix_sommet_points_id");
        var comment  = document.getElementById("choix_sommet_comment_id");

        // Seuls l'altitude et les points sont necessaires.
        // TODO: Verifier si ce sont des entiers
        if (altitude.value != '' && points.value != '') {
            res[0] = '<p> Nouveau sommet OK <p>';
        } else {
            res[0] = '<p class="invalide"> Sommet invalide : ' + altitude.value + ' / ' +  points.value + '<p>';
            res[1] = false;
        }
    } else {
        res[0] = '<p> Sommet Id = ' + sid + '</p>';
    }

    return res;
}

function check_pilote()
{
    var x = document.getElementById("choix_pilote_id");
    var pid = Number(x.options[x.selectedIndex].value);
    var res = new Array('', true);

    if (pid == 0) {
        // On verifie si on a bien declare un nouveau pilote
        var np = document.getElementById("choix_nouveau_pilote_id");
        if (np.value === '') {
            res[0] = '<p class="invalide"> Nom du pilote inconnu </p>';
            res[1] = false;
        } else {
            res[0] = '<p> Nouveau pilote = ' + np.value + '</p>';
        }
    } else {
        res[0] = '<p> Pilote Id = ' + pid + '</p>';
    }

    return res;
}

function check_date(d)
{
    var x = document.getElementById("choix_date_id");
    var res = new Array('', true);

    if (x.value == '') {
        res[0] = '<p class="invalide"> Vous devez saisir une date </p>';
        res[1] = false;
    } else {
        res[0] = '<p> Date saisie mais format pas encore verifie </p>';
    }

    return res;
}

function check_volrando()
{
    var info_vol = '';
    var biplace = document.getElementById("choix_biplace_id");
    var mobdouce = document.getElementById("choix_mobilitedouce_id");
    var comment = document.getElementById("choix_commentaire_id");
    var vol_valide = true;
    var res;

    res = check_massif();
    vol_valide &= res[1];
    info_vol += res[0];

    res = check_sommet();
    vol_valide &= res[1];
    info_vol += res[0];

    res = check_pilote();
    vol_valide &= res[1];
    info_vol += res[0];

    res = check_date();
    vol_valide &= res[1];
    info_vol += res[0];

    info_vol += '<p> biplace = ' + biplace.checked + '</p>';
    info_vol += '<p> mobdouce = ' + mobdouce.checked + '</p>';
    info_vol += '<p> commentaire = ' + comment.value + '</p>';

    if (vol_valide) {
        info_vol = '<h3> VOTRE VOL A ETE VALIDE </h3>' + info_vol ;
    } else {
        info_vol = '<h3 class="invalide"> VOTRE VOL EST INVALIDE  </h3>' + info_vol;
    }

    document.getElementById('zone_status').innerHTML= info_vol;
}
