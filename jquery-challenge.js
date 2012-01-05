// Les actions a faire lorsque la page est chargee.
$(document).ready(function() {

    init_saisie();

    // Affichage des volsrandos
    choix_affichage();

    // Detection de la selection du choix d'un massif
    $("#choix_massif_id").change(choix_massif);

    // Detection de la selection du choix d'un sommet
    $("#choix_sommet_id").change(choix_sommet);

    // Detection de la selection du choix d'un pilote
    $("#choix_pilote_id").change(choix_pilote);

    // Detection du choix de l'affichage
    $("#choix_affichage_id").change(choix_affichage);

    // Detection de la soumission du volrando
    $("#formulaire_volrando").submit(soumettre_volrando);
});

function init_saisie()
{
    // Activation de la saisie des massifs
    $('#choix_massif_id').empty();
    $('#choix_massif_id').append('<option value="0"> Choisir un massif </option>');
    $.ajax({
        url: 'server_queries.php',
        data : { param : "select_massifs" },
        success: function (data) {
            $('#choix_massif_id').append(data);
        },
        error : function () {
            alert("Erreur d'initialisation des massifs");
        }
    });

    // On desactive la saisie des sommets
    $('#choix_sommet_id').attr('disabled', true);

    $('#choix_nouveau_massif_id').attr('disabled', false);
    $('#choix_nouveau_sommet_id').attr('disabled', false);
    $('#choix_sommet_altitude_id').attr('disabled', false);
    $('#choix_sommet_points_id').attr('disabled', false);
    $('#choix_sommet_commentaire_id').attr('disabled', false);

    // Activation de la saisie des pilotes
    $('#choix_pilote_id').empty();
    $('#choix_pilote_id').append('<option value="0"> Choisir un pilote </option>');
    $.ajax({
        url: 'server_queries.php',
        data : { param : "select_pilotes" },
        success: function (data) {
            $('#choix_pilote_id').append(data);
        },
        error : function () {
            alert("Erreur d'initialisation des pilotes");
        }
    });

    $('#choix_nouveau_pilote_id').attr('disabled', false);
    
    // Preaffichage de la date d'aujourd'hui
    var today = new Date();
    $("#choix_date_id").val(today.getDate() + '/' + (today.getMonth() + 1));

}

function choix_massif()
{
    var selected = $("#choix_massif_id option:selected");

    if (selected.val() == 0) {
        // active le choix d'un nouveau massif et d'un nouveau
        // sommet
        $('#choix_nouveau_massif_id').attr('disabled', false);
        $('#choix_nouveau_sommet_id').attr('disabled', false);
        $('#choix_sommet_altitude_id').attr('disabled', false);
        $('#choix_sommet_points_id').attr('disabled', false);
        $('#choix_sommet_commentaire_id').attr('disabled', false);

        // desactive le choix des sommets
        $('#choix_sommet_id').empty();
        $('#choix_sommet_id').append('<option value="0"> Choisir un massif </option>');
        $('#choix_sommet_id').attr('disabled', true);
    } else {
        // active le choix d'un nouveau massif
        $('#choix_nouveau_massif_id').attr('disabled', true);

        // on active le choix d'un sommet
        $('#choix_sommet_id').attr('disabled', false);

        // generer le menu des sommets
        $('#choix_sommet_id').empty();
        $('#choix_sommet_id').append('<option value="0"> Choisir un sommet </option>');
        $.ajax({
            url: 'server_queries.php',
            data : { param : "select_sommets",
                     mid : selected.val()},
            success: function (data) {
                $('#choix_sommet_id').append(data);
            },
            error : function () {
                alert("Erreur d'initialisation des sommets");
            }
        });
    }

    return true;
}

function choix_sommet()
{
    var selected = $("#choix_sommet_id option:selected");

    // active les choix lies au sommet si le sommet est different de 0
    $('#choix_nouveau_sommet_id').attr('disabled', selected.val() != 0);
    $('#choix_sommet_altitude_id').attr('disabled', selected.val() != 0);
    $('#choix_sommet_points_id').attr('disabled', selected.val() != 0 );
    $('#choix_sommet_commentaire_id').attr('disabled', selected.val() != 0);

    return true;
}

function choix_pilote()
{
    var selected = $("#choix_pilote_id option:selected");

    $('#choix_nouveau_pilote_id').attr('disabled', selected.val() != 0);

    return true;
}

function choix_affichage()
{
    var selected = $("#choix_affichage_id option:selected");
    var parametre = "volrandos";

    if (selected.val() === "afficher_massifs") {
        parametre = "massifs";
    } else if (selected.val() === "afficher_sommets") {
        parametre = "sommets";
    } else if (selected.val() === "afficher_pilotes") {
        parametre = "pilotes";
    }

    // Affichage des resultats volrandos
    $.ajax({
        url: 'server_queries.php',
        data : { param : parametre },
        success: function (data) {
            $('#zone_resultats').html(data);
        },
        error : function () {
            $('#zone_resultats').html('Failure...');
        }
    });

    return true;
}

function soumettre_volrando()
{
    var info_vol = '';
    var vol_valide = true;
    var biplace = $("#choix_biplace_id:checked").val() == undefined ? 0 : 1;
    var mobdouce = $("#choix_mobilitedouce_id:checked").val() == undefined ? 0 : 1;
    var comment = $("#choix_commentaire_id").val();
    var res;

    res = check_massif();
    info_vol += res[0];
    vol_valide &= res[1];
    var mid= res[2];
    var nm= res[3]; // nm: nom massif

    res = check_sommet();
    info_vol += res[0];
    vol_valide &= res[1];
    var sid  = res[2];
    var ns   = res[3]; // ns: nom sommet
    var alti = res[4];
    var pts  = res[5];
    var cs   = res[6]; // cs: commentaire sommet

    res = check_pilote();
    info_vol += res[0];
    vol_valide &= res[1];
    var pid = res[2];
    var np  = res[3]; // np: nom pilote

    // A faire : la date
    res = check_date();
    info_vol += res[0];
    vol_valide &= res[1];
    var date = res[2];
    
    info_vol += 'biplace = ' + biplace + ' => OK \n';
    info_vol += 'mobdouce = ' + mobdouce + ' => OK \n';
    info_vol += 'commentaire = ' + comment + ' => OK \n';

    if (vol_valide) {
        info_vol = 'VOTRE VOL A ETE VALIDE \n';
        info_vol += 'Cliquez sur ok pour soumettre, Cancel pour annuler \n';
        var rep = confirm(info_vol);

        if (rep == true) {
            // On envoit au serveur
            $.ajax({
                url: 'server_queries.php',
                data : {
                    param   : "ajout_volrando",
                    mid     : mid,
                    nm      : nm,
                    sid     : sid,
                    ns      : ns,
                    alti    : alti,
                    pts     : pts,
                    cs      : cs,
                    pid     : pid,
                    np      : np,
                    date    : date,
                    bi      : biplace,
                    md      : mobdouce,
                    cv      : comment},
                success: function (data) {
                    $('#zone_resultats').html(data);
            
                    // On reinitialise la zone de saisie
                    init_saisie();
    
                    // Affichage des volsrandos
                    choix_affichage();
                },
                error : function () {
                    $('#zone_resultats').html('Failure...');
                }
            });

        }
    } else {
        info_vol = '-=( ERREUR: VOTRE VOL EST INVALIDE )=- \n\n' + info_vol;
        alert(info_vol);
    }
    
    return false;
}

/********************************************************************
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
 * res[0] = txt
 * res[1] = requete valide ou pas
 * res[2] = mid
 * si res[2] == 0 or NaN
 *   alore res[3] = nom
 */
function check_massif()
{
    var x = $("#choix_massif_id option:selected").val();
    var res = new Array('', true, Number(x), '');

    if ((res[2] == 0) || isNaN(res[2])) {
        // On verifie si il y a un nouveau massif de declare.
        res[3] = $("#choix_nouveau_massif_id").val();

        // Verifie si c'est une string
        if (res[3] === '') {
            res[0] = 'Aucun massif declare \n';
            res[1] = false;
        } else {
            res[3] = format_nom(res[3]);
            res[0] = 'Nouveau Massif = ' + res[3] + ' => OK \n';
        }
    } else {
        res[0] = 'Massif Id  = ' +  res[2]+ ' => OK \n';
    }

    return res;
}

/*
 * res[0] = text
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
    var x = $("#choix_sommet_id option:selected").val();
    var res = new Array('', true, Number(x),'', 0, 0, '');

    if ((res[2] == 0) || isNaN(res[2])) {
        // On verifie si on a tous les elements pour notre nouveau sommet
        res[3] = $("#choix_nouveau_sommet_id").val();
        res[4] = Number($("#choix_sommet_altitude_id").val());
        res[5] = Number($("#choix_sommet_points_id").val());
        res[6] = $("#choix_sommet_commentaire_id").val();

        // verification du nom
        if (res[3] === '') {
            res[0] = 'Le nouveau sommet est sans nom...\n';
            res[1] = false;
        }

        // verification de l'altitude
        if (isNaN(res[4]) || (res[4] < 0)) {
            res[0] += 'Altitude invalide \n';
            res[1] = false;
        }

        // Il reste à verifier si le nombre de points est bien compris
        // entre 1 et altitude/1000
        if (isNaN(res[5]) || res[5] < 1) {
            res[0] += 'Nombre de points invalide \n';
            res[1] = false;
        }

        if (res[1]) {
            res[3] = format_nom(res[3]);
            res[0] = 'Nouveau Sommet ' + res[3] + ' => OK \n';
        }
    } else {
        res[0] = 'Sommet Id = ' + res[2] + ' => OK \n';
    }

    return res;
}

/*
 * res[0] = text
 * res[1] = pilote valide ou non
 * res[2] = pid
 * si res[2] == 0 ou NaN
 * alors
 *   res[3] = nom
 */
function check_pilote()
{
    var x = $("#choix_pilote_id option:selected").val();
    var res = new Array('', true, Number(x), '');

    if ((res[2] == 0) || isNaN(res[2])) {
        // On verifie si on a bien declare un nouveau pilote
        res[3] = $("#choix_nouveau_pilote_id").val();

        if (res[3] === '') {
            res[0] = 'Nom du pilote inconnu \n';
            res[1] = false;
        } else {
            res[0] = 'Nouveau pilote = ' + res[3] + ' => OK \n';
        }
    } else {
        res[0] = 'Pilote Id = ' + res[2] + ' => OK\n';
    }

    return res;
}

/*
 * res[0] = text
 * res[1] = date valide ou non
 * res[2] = date
 */
function check_date()
{
    var res = new Array('', true, $("#choix_date_id").val());
    var ds = res[2].split("/");

    if (ds.length == 2) {
        // verification grosso merdo...
        if (ds[0] > 0 && ds[1] < 31 && ds[1] > 0 && ds[1] < 13) {
            res[0] = 'Date saisie : ' + res[2] + ' => OK\n';
            return res;
        }
    }

    res[0] = 'Date invalide \n';
    res[1] = false;
    return res;
}
