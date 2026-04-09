var carrello = [];
var utente = null;

document.getElementById("fileInput").onchange = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var testo = e.target.result;
        var righe = testo.split("\n");

        var contenitore = document.getElementById("prodotti");
        contenitore.innerHTML = "";

        for (var i = 1; i < righe.length; i++) {

            if (righe[i].trim() == "") continue;

            var colonne = righe[i].split(",");

            if (colonne.length < 4) continue;

            var tipo = colonne[0].trim();
            var nome = colonne[1].trim();
            var descrizione = colonne[2].trim();
            var prezzo = colonne[3].trim();

            var div = document.createElement("div");
            div.className = "card";

            div.innerHTML =
                "<h3>" + nome + "</h3>" +
                "<p>Tipo: " + tipo + "</p>" +
                "<p>" + descrizione + "</p>" +
                "<p>Prezzo: " + prezzo + " euro</p>" +
                "<button onclick=\"aggiungiCarrello('" + nome + "'," + prezzo + ")\">Aggiungi</button>";

            contenitore.appendChild(div);
        }
    };

    reader.readAsText(file, "UTF-8");
};

function registrati() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;

    if (nome != "" && email != "") {
        utente = { nome: nome, email: email };
        alert("Registrazione completata");
    } else {
        alert("Compila tutti i campi");
    }
}

function aggiungiCarrello(nome, prezzo) {
    var prodotto = { nome: nome, prezzo: prezzo };
    carrello.push(prodotto);
    aggiornaCarrello();
}

function aggiornaCarrello() {
    var div = document.getElementById("carrello");
    div.innerHTML = "";

    var totale = 0;

    for (var i = 0; i < carrello.length; i++) {
        div.innerHTML += carrello[i].nome + " - " + carrello[i].prezzo + " euro<br>";
        totale = totale + parseFloat(carrello[i].prezzo);
    }

    div.innerHTML += "<b>Totale: " + totale + " euro</b>";
}

function acquista() {
    if (utente == null) {
        alert("Devi registrarti");
        return;
    }

    if (carrello.length == 0) {
        alert("Carrello vuoto");
        return;
    }

    alert("Acquisto completato da " + utente.nome);
}