# Mini Dashboard Meteo

Piccola web app che mostra il meteo di una città usando **XMLHttpRequest**.

## Descrizione
L'utente scrive il nome di una città. L'app fa due richieste AJAX (GET con parametri in query string) alle API pubbliche di Open-Meteo:
1. geocoding: dal nome della città ricava latitudine e longitudine;
2. meteo: con le coordinate ricava temperatura, vento, condizione attuale e previsioni dei prossimi 3 giorni.

Le risposte sono in JSON: vengono lette con `responseText` e `JSON.parse()` e mostrate nella pagina con il DOM. Sono gestiti gli errori HTTP, di rete e di timeout.

## Tecnologie
- HTML, CSS, JavaScript
- XMLHttpRequest (`open()`, `send()`, `onload`, `onerror`, `ontimeout`)
- API Open-Meteo (nessuna chiave richiesta)

## Come avviarlo
Non aprire `index.html` con doppio clic (`file://`): serve un server locale. Nella cartella del progetto:

```bash
python -m http.server 8000
```

poi apri http://localhost:8000 nel browser. In alternativa: `npx serve` oppure l'estensione Live Server di VS Code.

## Autore
Piro
