/*
 * 
 */
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
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        {
            // On recupere les donnees sous forme de texte brut
            callback(xhr.responseText);
        }
    }

    // true => mode de transfert asynchrone
    xhr.open("GET","get_tables.php",true);
    xhr.send();
}

/*
 * Callback utilise pour traiter les donnees retournees lors du GET
 * de la requete AJAX.
 */
function get_tables(oData) {
    document.getElementById("resultats").innerHTML = oData;
}

/*
 * Cette fonction permet de valider un minimum les donnees passees
 * en parametre du vol rando avant d'envoyer la requete d'ajout
 * dans la base de donnee au serveur
 */
function check_volrando()
{
    var x = document.getElementById("saisieVolrando"),
        monTexte = "  ===== INFO DU VOL ===== <br />";

    // Il y a 7 elements dans cet ordre:
    //  0) sommet
    //  1) pilote
    //  2) date
    //  3) biplace
    //  4) co2
    //  5) commentaire
    //  6) soumettre le volrando
    if (x.length != 7) {
        alert('Fatal Error');
        return false;
    }

    monTexte = monTexte +
           x.elements[0].name + ' : ' + x.elements[0].selectedIndex + '<br />' +
           x.elements[1].name + ' : ' + x.elements[1].selectedIndex + '<br />' +
           x.elements[2].name + ' : ' + x.elements[2].value + '<br />' +
           x.elements[3].name + ' : ' + x.elements[3].checked + '<br />' +
           x.elements[4].name + ' : ' + x.elements[4].checked + '<br />' +
           x.elements[5].name + ' : ' + x.elements[5].value + '<br />';

    //alert(monTexte);
    document.getElementById('status').innerHTML= monTexte;
}
