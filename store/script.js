var prodotti = [];
var carrello = [];
var utente = null;


var input = document.getElementById("fileInput");

if (input) {
    input.onchange = function (e) {

        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {

            var righe = event.target.result.split("\n");
            prodotti = [];

            for (var i = 1; i < righe.length; i++) {

                if (righe[i].trim() === "") continue;

                var c = righe[i].split(",");

                prodotti.push({
                    tipo: c[0],
                    nome: c[1],
                    descrizione: c[2],
                    prezzo: c[3]
                });
            }

            mostraProdotti();
        };

        reader.readAsText(file, "UTF-8");
    };
}


function mostraProdotti() {

    var div = document.getElementById("prodotti");
    div.innerHTML = "";

    for (var i = 0; i < prodotti.length; i++) {

        var p = prodotti[i];

        div.innerHTML += `
        <div class="card">
            <h3>${p.nome}</h3>
            <p>Tipo: ${p.tipo}</p>
            <p>Prezzo: ${p.prezzo} euro</p>
            <button onclick="vaiDettaglio(${i})">Dettaglio</button>
        </div>`;
    }
}


function vaiDettaglio(i) {
    localStorage.setItem("prodotto", JSON.stringify(prodotti[i]));
    window.location.href = "dettaglio.html";
}


var d = document.getElementById("dettaglio");

if (d) {

    var p = JSON.parse(localStorage.getItem("prodotto"));

    d.innerHTML =
        "<div class='card'>" +
        "<h3>" + p.nome + "</h3>" +
        "<p>" + p.tipo + "</p>" +
        "<p>" + p.descrizione + "</p>" +
        "<p>Prezzo: " + p.prezzo + " euro</p>" +
        "<button onclick='aggiungiCarrello()'>Aggiungi al carrello</button>" +
        "</div>";
}


function aggiungiCarrello() {

    var p = JSON.parse(localStorage.getItem("prodotto"));

    carrello.push(p);
    aggiornaCarrello();
}

function aggiornaCarrello() {

    var div = document.getElementById("carrello");

    if (!div) return;

    var totale = 0;
    div.innerHTML = "";

    for (var i = 0; i < carrello.length; i++) {

        div.innerHTML += carrello[i].nome + "<br>";
        totale += parseFloat(carrello[i].prezzo);
    }

    div.innerHTML += "<br><b>Totale: " + totale + " euro</b>";
}


function registrati() {

    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;

    if (nome && email) {
        utente = { nome: nome, email: email };
        alert("Registrazione completata!");
    }
}


function acquista() {

    if (!utente) {
        alert("Devi registrarti!");
        return;
    }

    if (carrello.length === 0) {
        alert("Carrello vuoto!");
        return;
    }

    window.print();
}