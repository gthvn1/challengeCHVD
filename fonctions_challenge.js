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
 * dans la base de donnee au serveur
 */
function check_number(n)
{
    if (isNaN(n) || n == 0)
        return false;
    else
        return true;
}

/*
 * Pour l'instant on retourne le html
 */
function check_massif()
{
    var x = document.getElementById("choix_massif_id");
    var mid = Number(x.options[x.selectedIndex].value);
    var txt;
   
    if (mid == 0) {
        // On verifie si il y a un nouveau massif
        // de declare.
        var nm = document.getElementById("choix_nouveau_massif_id");

        if (nm.value) {
            txt = '<p> Nouveau Massif = ' + nm.value + '</p>';
        } else {
            txt = '<p class="invalide"> Aucun massif declare </p>';
        }
    } else {
        txt = '<p> Massif Id  = ' + mid + '</p>';
    }
    return txt;
}

function check_sommet()
{
    var x = document.getElementById("choix_sommet_id");
    var sid = Number(x.options[x.selectedIndex].value);
    
    return '<p> Sommet Id = ' + sid + '</p>';
}

function check_pilote()
{
    var x = document.getElementById("choix_pilote_id");
    var pid = Number(x.options[x.selectedIndex].value);
    
    return '<p> Pilote Id = ' + pid + '</p>';
}

// on verifie seulement si la string n'est pas vide
function check_date(d)
{
    var x = document.getElementById("choix_date_id");
    var d = x.value;
    
    return '<p> Date : ' + d + '</p>';
}

function check_volrando()
{
    var info_vol;

    /*
    // x contient tous les elements dans la FORM
        e_datevol           = x.elements["choix_date_name"],
        e_biplace           = x.elements["choix_biplace_name"],
        e_mobdouce          = x.elements["choix_mobilitedouce_name"],
        e_comment           = x.elements["choix_commentaire_name"];
    // on recupere les index de selection pour les trois listes
        si_sommet = e_sommet.selectedIndex,
        si_pilote = e_pilote.selectedIndex,

    // et maintenant on peut recuperer les valeurs
        sid = Number(e_sommet.options[si_sommet].value),
        pid = Number(e_pilote.options[si_pilote].value),

        nouveau_massif = e_nouveau_massif.value,
        nouveau_sommet = e_nouveau_sommet.value,
        nouveau_pilote = e_nouveau_pilote.value,

        sommet_altitude = Number(e_sommet_altitude.value),
        sommet_points   = Number(e_sommet_points.value),
        sommet_comment  = Number(e_sommet_commentaire.value),

        datevol  = e_datevol.value,
        biplace  = (e_biplace.checked)  ? 1 : 0,
        mobdouce = (e_mobdouce.checked) ? 1 : 0,
        comment  = e_comment.value;
    */
    /*
    if (check_number(mid) && check_number(sid) && 
            check_number(pid) && check_date(datevol)) {
        monTexte = ' <p> VOTRE VOL A ETE VALIDE </p>';
        volvalide = true;
    } else {
        monTexte = ' <p class="invalide"> VOTRE VOL EST INVALIDE </p>';
        volvalide = false;
    }
    */
        
    info_vol = '<h3> INFORMATION SUR LA DECLARAION </h3>';

    info_vol += check_massif();
    info_vol += check_sommet();
    info_vol += check_pilote();
    info_vol += check_date();

    document.getElementById('zone_status').innerHTML= info_vol;
}
