// Mini Dashboard Meteo - usa XMLHttpRequest e le API pubbliche di Open-Meteo.
// Passo 1: dal nome della città ricavo latitudine e longitudine (geocoding).
// Passo 2: con latitudine e longitudine chiedo il meteo.

var URL_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search';
var URL_METEO = 'https://api.open-meteo.com/v1/forecast';

// ---------- funzioni di utilità ----------

function mostraMessaggio(testo, isErrore) {
  var p = document.getElementById('messaggio');
  p.textContent = testo;
  if (isErrore) {
    p.className = 'errore';
  } else {
    p.className = '';
  }
}

function nascondiRisultato() {
  document.getElementById('risultato').className = 'nascosto';
}

function descrizioneMeteo(codice) {
  if (codice === 0) {
    return 'Sereno';
  } else if (codice >= 1 && codice <= 3) {
    return 'Poco nuvoloso / nuvoloso';
  } else if (codice === 45 || codice === 48) {
    return 'Nebbia';
  } else if (codice >= 51 && codice <= 57) {
    return 'Pioggerella';
  } else if (codice >= 61 && codice <= 67) {
    return 'Pioggia';
  } else if (codice >= 71 && codice <= 77) {
    return 'Neve';
  } else if (codice >= 80 && codice <= 82) {
    return 'Rovesci di pioggia';
  } else if (codice === 85 || codice === 86) {
    return 'Rovesci di neve';
  } else if (codice >= 95) {
    return 'Temporale';
  }
  return 'Non disponibile';
}

// ---------- richiesta 1: cerco la città (GET con query string) ----------

function cercaCitta(nome) {
  var xhr = new XMLHttpRequest();

  var url = URL_GEOCODING +
    '?name=' + encodeURIComponent(nome) +
    '&count=1&language=it&format=json';

  xhr.onload = function () {
    if (xhr.status === 200) {
      var dati = JSON.parse(xhr.responseText);

      if (!dati.results || dati.results.length === 0) {
        mostraMessaggio('Città non trovata: controlla il nome.', true);
        return;
      }
      cercaMeteo(dati.results[0]);
    } else {
      mostraMessaggio('Errore HTTP: ' + xhr.status, true);
    }
  };

  xhr.onerror = function () {
    mostraMessaggio('Errore di rete: server irraggiungibile.', true);
  };

  xhr.ontimeout = function () {
    mostraMessaggio('Timeout: il server ci mette troppo a rispondere.', true);
  };

  xhr.timeout = 8000;
  xhr.open('GET', url, true);
  xhr.send();
}

// ---------- richiesta 2: chiedo il meteo (GET con query string) ----------

function cercaMeteo(luogo) {
  var xhr = new XMLHttpRequest();

  var url = URL_METEO +
    '?latitude=' + luogo.latitude +
    '&longitude=' + luogo.longitude +
    '&current_weather=true' +
    '&daily=temperature_2m_max,temperature_2m_min' +
    '&forecast_days=3' +
    '&timezone=auto';

  xhr.onload = function () {
    if (xhr.status === 200) {
      var dati = JSON.parse(xhr.responseText);
      mostraMeteo(luogo, dati);
    } else {
      mostraMessaggio('Errore HTTP: ' + xhr.status, true);
    }
  };

  xhr.onerror = function () {
    mostraMessaggio('Errore di rete: server irraggiungibile.', true);
  };

  xhr.ontimeout = function () {
    mostraMessaggio('Timeout: il server ci mette troppo a rispondere.', true);
  };

  xhr.timeout = 8000;
  xhr.open('GET', url, true);
  xhr.send();
}

// ---------- rendering nel DOM ----------

function mostraMeteo(luogo, dati) {
  var attuale = dati.current_weather;

  var titolo = luogo.name;
  if (luogo.country) {
    titolo = titolo + ' (' + luogo.country + ')';
  }

  document.getElementById('nomeLuogo').textContent = titolo;
  document.getElementById('temperatura').textContent = attuale.temperature + ' °C';
  document.getElementById('vento').textContent = attuale.windspeed + ' km/h';
  document.getElementById('condizione').textContent = descrizioneMeteo(attuale.weathercode);

  // tabella delle previsioni
  var corpo = document.getElementById('previsioni');
  corpo.textContent = '';

  for (var i = 0; i < dati.daily.time.length; i++) {
    var riga = document.createElement('tr');

    var cellaGiorno = document.createElement('td');
    cellaGiorno.textContent = dati.daily.time[i];

    var cellaMin = document.createElement('td');
    cellaMin.textContent = dati.daily.temperature_2m_min[i] + ' °C';

    var cellaMax = document.createElement('td');
    cellaMax.textContent = dati.daily.temperature_2m_max[i] + ' °C';

    riga.appendChild(cellaGiorno);
    riga.appendChild(cellaMin);
    riga.appendChild(cellaMax);
    corpo.appendChild(riga);
  }

  mostraMessaggio('', false);
  document.getElementById('risultato').className = '';
}

// ---------- input dell'utente ----------

function avviaRicerca() {
  var nome = document.getElementById('citta').value.trim();

  if (nome === '') {
    nascondiRisultato();
    mostraMessaggio('Scrivi il nome di una città.', true);
    return;
  }

  nascondiRisultato();
  mostraMessaggio('Ricerca in corso...', false);
  cercaCitta(nome);
}

document.getElementById('btnCerca').addEventListener('click', avviaRicerca);

document.getElementById('citta').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    avviaRicerca();
  }
});
