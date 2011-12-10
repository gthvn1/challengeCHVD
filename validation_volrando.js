function checkVolrando()
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
