// Les actions a faire lorsque la page est chargee.
$(document).ready(function() {

    // Activation de la saisie des massifs
    $.ajax({
        url: 'server_queries.php',
        data : { param : "select_massifs" },
        success: function (data) {
            $('#choix_massif_id').append(data);
        },
        error : function () {
            $('#zone_saisie_massif').html('Failure...');
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
    $.ajax({
        url: 'server_queries.php',
        data : { param : "select_pilotes" },
        success: function (data) {
            $('#choix_pilote_id').append(data);
        },
        error : function () {
            $('#zone_saisie_pilote').html('Failure...');
        }
    });

    $('#choix_nouveau_pilote_id').attr('disabled', false);

    // Affichage des resultats
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
                $('#zone_saisie_sommet').html('Failure...');
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
    var t = "Info sur le vol \n";

    t += "Massif Id = " + $("#choix_massif_id option:selected").val() + "\n";
    t += "Nouveau massif = " + $("#choix_nouveau_massif_id").val() + "\n";
    t += "Sommet ID = " + $("#choix_sommet_id option:selected").val() + "\n";
    t += "Nouveau sommet = " + $("#choix_nouveau_sommet_id").val() + "\n";
    t += "sommet altitude = " + $("#choix_sommet_altitude_id").val() + "\n";
    t += "sommet points = " + $("#choix_sommet_points_id").val() + "\n";
    t += "sommet commentaire = " + $("#choix_sommet_commentaire_id").val() + "\n";
    t += "Pilote ID = " + $("#choix_pilote_id option:selected").val() + "\n";
    t += "Nouveau pilote = " + $("#choix_nouveau_pilote_id").val() + "\n";

    // Il faudra tester si c'est undefined pour savoir si c'est checked ou pas
    t += "Biplace = " + $("#choix_biplace_id:checked").val() + "\n";
    t += "Sans CO2 = " + $("#choix_mobilitedouce_id:checked").val() + "\n";

    t += "Commentaire = " + $("#choix_commentaire_id").val() + "\n";

    alert(t);
    return false;
}
