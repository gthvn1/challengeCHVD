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
 * Fonctions d'envoie des requetes au serveur
 */

function ask_to_server(arg, zone)
{
    var xhr = getXhr();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4) {
            if ((xhr.status == 200 || xhr.status == 0)) {
                document.getElementById(zone).innerHTML = xhr.responseText;
            } else {
                alert('Error [' + arg + ']  status =' + xhr.status);
            }
        }
    }

    // true => mode de transfert asynchrone
    xhr.open("GET","server_queries.php?param=" + arg, true);
    xhr.send();
}

/********************************************************************
 * Les fonctions gmd_ sont les fonctions de Generation de Menus
 * Deroulants
 */

function gmd_pilotes()
{
    ask_to_server("select_pilotes", "zone_saisie_pilote");
}

/*
 * La fonction gmd_massifs est appelee lors du chargement de la page
 * web. Elle sera egalement appelee lorsqu'un nouveau vol sera ajoute
 * dans la base de donnee.
 */
function gmd_massifs()
{
    ask_to_server("select_massifs", "zone_saisie_massif");
}

/*
 * Cette fonction est appelee lorsqu'un massif a ete selectionne. Il faut donc griser
 * la zone de saisie des nouveaux massifs.
 */
function gmd_sommets()
{
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
            disable_saisie_sommet();
    } else {
        document.getElementById('zone_saisie_nouveau_massif').innerHTML =
            enable_saisie_nouveau_massif(false);

        ask_to_server("select_sommets&mid=" + mid, "zone_saisie_sommet");
    }
}

/********************************************************************
 * Fonction d'initialisation de la zone de saisie des massifs,
 * sommets et pilotes.
 */
function init_zone_saisie()
{
    ask_to_server("select_massifs", "zone_saisie_massif");
    
    document.getElementById('zone_saisie_nouveau_massif').innerHTML =
        enable_saisie_nouveau_massif(true);

    document.getElementById('zone_saisie_sommet').innerHTML =
        disable_saisie_sommet();

    document.getElementById('zone_saisie_nouveau_sommet').innerHTML =
        enable_saisie_nouveau_sommet(true);

    document.getElementById('zone_saisie_sommet_altitude').innerHTML =
        enable_saisie_sommet_altitude(true);

    document.getElementById('zone_saisie_sommet_points').innerHTML =
        enable_saisie_sommet_points(true);

    document.getElementById('zone_saisie_sommet_commentaire').innerHTML =
        enable_saisie_sommet_commentaire(true);

    ask_to_server("select_pilotes", "zone_saisie_pilote");
    
    document.getElementById('zone_saisie_nouveau_pilote').innerHTML =
        enable_saisie_nouveau_pilote(true);
}

/********************************************************************
 * Les fonctions suivantes sont utilisees pour activer ou desactiver
 * les differents choix de la zone de saisie du vol rando.
 */

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

    text =  '<label for="choix_sommet_id">Choix du sommet</label>';
    text += '  <select id="choix_sommet_id" disabled="disabled">';
    text += '  <option> Choisir un massif </option>';

    return text;
}

function enable_saisie_generique(titre, id, choix)
{
    var text;

    text = '<label for="' + id + '">' + titre + '</label>';
        text += '<input type="text" id="' + id;
    if (choix) {
        text += '">';
    } else {
        text += '" disabled="disabled">';
    }

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
 *
 * Fonctions de validation des champs du volrando declare et
 * fonctions permettant de formaliser le nom des massifs et des
 * sommets.
 */

/* Pour que tout soit plus simple a gerer on mets tout en minuscule
 * sauf la premiere lettre. Je gere aussi les cas avec les apostrophes.
 * C'est un peu bourrin mais bon.
 */
function format_nom(nom)
{
    var res = nom.split(" ");
    var nouveau_nom = '';
    var i;

    for (i = 0; i < res.length; i++) {
        // on traite les cas des apostrophes avec ou sans espaces.
        // Ie: 1) d'arcluz => d'Arcluz
        //     2) d' arcluz => d'Arcluz
        //     3) d arcluz => d'Arcluz
        if (res[i].length == 1) {
            // cas 3
            nouveau_nom += res[i] + "'";
            continue;
        }

        if ((res[i].length == 2) && (res[i][1] == "'")) {
            // cas 2
            nouveau_nom += res[i];
            continue;
        }

        if (res[i][1] == "'") {
            // cas 1
            nouveau_nom += res[i][0] + res[i][1] +
                cap_premiere_lettre(res[i].slice(2)) + " ";
            continue;
        }

        if (dont_cap(res[i]) && i != 0)
            nouveau_nom += res[i] + " ";
        else
            nouveau_nom += cap_premiere_lettre(res[i]) + " ";
    }

    // on vire le dernier blanc
    return nouveau_nom.substring(0, nouveau_nom.length - 1);;
}

function dont_cap(string)
{
    // C'est pas tres jolie mais je ne sais pas encore faire autrement
    // On ne met pas de majuscule au le, la, de, du, des, les ...
    var e = new Array('le', 'les', 'la', 'du', 'des', 'de');

    for (var i=0; i < e.length; i++) {
        if (string == e[i]) {
            return true;
        }
    }
    return false;
}

function cap_premiere_lettre(string)
{
    if (string)
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    else
        return "";
}

/*
 * Pour l'instant on retourne un tableau contenant le html et la validite
 * du vol.
 *
 * res[0] = txt html
 * res[1] = requete valide ou pas
 * res[2] = mid
 * si res[2] == 0 or NaN
 *   alore res[3] = nom
 */
function check_massif()
{
    var x = document.getElementById("choix_massif_id");
    var res = new Array('', true, Number(x.options[x.selectedIndex].value), '');

    if ((res[2] == 0) || isNaN(res[2])) {
        // On verifie si il y a un nouveau massif de declare.
        res[3] = document.getElementById("choix_nouveau_massif_id").value;

        // Verifie si c'est une string
        if (res[3] === '') {
            res[0] = '<p class="invalide"> Aucun massif declare </p>';
            res[1] = false;
        } else {
            res[3] = format_nom(res[3]);
            res[0] = '<p> Nouveau Massif = ' + res[3] + '</p>';
        }
    } else {
        res[0] = '<p> Massif Id  = ' +  res[2]+ '</p>';
    }

    return res;
}

/*
 * res[0] = text html
 * res[1] = sommet valide ou non
 * res[2] = sid
 * si res[2] == 0 or NaN
 * alors
 *   res[3] = nom
 *   res[4] = altitude
 *   res[5] = points
 *   res[6] = commentaire
 */
function check_sommet()
{
    var x = document.getElementById("choix_sommet_id");
    var res = new Array('', true, Number(x.options[x.selectedIndex].value),
                        '', 0, 0, '');

    if ((res[2] == 0) || isNaN(res[2])) {
        // On verifie si on a tous les elements pour notre nouveau sommet
        res[3] = document.getElementById("choix_nouveau_sommet_id").value;
        res[4] = Number(document.getElementById("choix_sommet_altitude_id").value);
        res[5] = Number(document.getElementById("choix_sommet_points_id").value);
        res[6] = document.getElementById("choix_sommet_commentaire_id").value;

        // verification du nom
        if (res[3] === '') {
            res[0] = '<p class="invalide"> Le nouveau sommet est sans nom...</p>';
            res[1] = false;
        }

        // verification de l'altitude
        if (isNaN(res[4]) || (res[4] < 0)) {
            res[0] += '<p class="invalide"> Altitude invalide </p>';
            res[1] = false;
        }

        // Il reste à verifier si le nombre de points est bien compris
        // entre 1 et altitude/1000
        if (isNaN(res[5]) || res[5] < 1) {
            res[0] += '<p class="invalide"> Nombre de points invalide </p>';
            res[1] = false;
        }

        if (res[1]) {
            res[3] = format_nom(res[3]);
            res[0] = '<p> Nouveau Sommet ' + res[3] + ' ok </p>';
        }
    } else {
        res[0] = '<p> Sommet Id = ' + res[2] + '</p>';
    }

    return res;
}

/*
 * res[0] = text html
 * res[1] = pilote valide ou non
 * res[2] = pid
 * si res[2] == 0 ou NaN
 * alors
 *   res[3] = nom
 */
function check_pilote()
{
    var x = document.getElementById("choix_pilote_id");
    var res = new Array('', true, Number(x.options[x.selectedIndex].value), '');

    if ((res[2] == 0) || isNaN(res[2])) {
        // On verifie si on a bien declare un nouveau pilote
        res[3] = document.getElementById("choix_nouveau_pilote_id").value;

        if (res[3] === '') {
            res[0] = '<p class="invalide"> Nom du pilote inconnu </p>';
            res[1] = false;
        } else {
            res[0] = '<p> Nouveau pilote = ' + res[3] + '</p>';
        }
    } else {
        res[0] = '<p> Pilote Id = ' + res[2] + '</p>';
    }

    return res;
}

/*
 * res[0] = text html
 * res[1] = date valide ou non
 * res[2] = date
 */
function check_date(d)
{
    var res = new Array('', true, document.getElementById("choix_date_id").value);
    var ds = res[2].split("/");

    if (ds.length == 2) {
        // verification grosso merdo...
        if (ds[0] > 0 && ds[1] < 31 && ds[1] > 0 && ds[1] < 13) {
            res[0] = '<p> Date saisie : ' + res[2] + '</p>';
            return res;
        }
    }

    res[0] = '<p class="invalide"> Date invalide </p>';
    res[1] = false;
    return res;
}

/*
 * Cette fonction permet de valider un minimum les donnees passees
 * en parametre du vol rando avant d'envoyer la requete d'ajout
 * dans la base de donnee au serveur ... ou pas.
 */
function check_volrando()
{
    var requete = 'ajout_volrando';
    var info_vol = '';
    var biplace = document.getElementById("choix_biplace_id");
    var mobdouce = document.getElementById("choix_mobilitedouce_id");
    var comment = document.getElementById("choix_commentaire_id");
    var vol_valide = true;
    var res;

    res = check_massif();
    info_vol += res[0];
    vol_valide &= res[1];
    requete += '&mid=' + res[2];
    requete += '&nm='  + res[3]; // nm: nom massif

    res = check_sommet();
    info_vol += res[0];
    vol_valide &= res[1];
    requete += '&sid='  + res[2];
    requete += '&ns='   + res[3]; // ns: nom sommet
    requete += '&alti=' + res[4];
    requete += '&pts='  + res[5];
    requete += '&cs='   + res[6]; // cs: commentaire sommet

    res = check_pilote();
    info_vol += res[0];
    vol_valide &= res[1];
    requete += '&pid=' + res[2];
    requete += '&np='  + res[3]; // np: nom pilote

    res = check_date();
    info_vol += res[0];
    vol_valide &= res[1];
    requete += '&date=' + res[2];

    info_vol += '<p> biplace = ' + biplace.checked + '</p>';
    requete += '&bi=' + biplace.checked;
    info_vol += '<p> mobdouce = ' + mobdouce.checked + '</p>';
    requete += '&md=' + mobdouce.checked;
    info_vol += '<p> commentaire = ' + comment.value + '</p>';
    requete += '&cv=' + comment.value;

    if (vol_valide) {
        info_vol = '<h3> VOTRE VOL A ETE VALIDE </h3>' + info_vol ;
        ask_to_server(requete, 'zone_resultats');
        init_zone_saisie();
    } else {
        info_vol = '<h3 class="invalide"> VOTRE VOL EST INVALIDE  </h3>' + info_vol;
    }

    alert(info_vol);

}


function affichage_table()
{
    var e =  document.getElementById("choix_affichage_id");
    var choix = e.options[e.selectedIndex].value;

    if (choix == 'afficher_volrandos') {
        ask_to_server('volrandos', 'zone_resultats');
    }
    else if (choix == 'afficher_pilotes') {
        ask_to_server('pilotes', 'zone_resultats');
    }
    else if (choix == 'afficher_sommets') {
        ask_to_server('sommets', 'zone_resultats');
    }
    else if (choix == 'afficher_massifs') {
        ask_to_server('massifs', 'zone_resultats');
    }
}
