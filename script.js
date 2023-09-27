// Definerer en global variabel for å lagre konverteringshistorikk
const conversionHistory = []; // For å lagre konverteringshistorikk
const favoriteConversions = []; // For å lagre favorittkonverteringer

// Funksjon med et ganske selvforklarende ord
function calculate() {
    // Henter verdier fra inputfelt og elementer i HTML
    const usdAmount = parseFloat(document.getElementById('usdAmount').value); // Henter beløpet i USD
    const fromCurrency = document.getElementById('fromCurrency').value; // Henter valutaen som skal konverteres
    const selectedCheckboxes = document.getElementsByClassName('currencyCheckbox'); // Henter alle valuta-sjekkbokser
    const toCurrencies = Array.from(selectedCheckboxes) // Kopierer elementene fra selectedCheckboxes til en ny array
                          .filter(checkbox => checkbox.checked) // Filtrer ut de merkede sjekkboksene
                          .map(checkbox => checkbox.value); // Lager en liste over valutaer som er valgt for konvertering
    const resultContainer = document.getElementById('result'); // Henter elementet for resultatvisning

    Promise.all(
        toCurrencies.map(toCurrency =>
            fetch(`https://v6.exchangerate-api.com/v6/latest/${fromCurrency}`) // Henter valuta-kurs-data fra API, husk å bytte ut med din, jeg tør ikke å legge ut min :(
                .then(response => response.json()) // Konverterer responsen til JSON-format
                .then(data => {
                    const exchangeRate = data.conversion_rates[toCurrency]; // Henter valutakursen
                    const result = usdAmount * exchangeRate; // Beregner konvertert beløp
                    const conversionText = `${usdAmount} ${fromCurrency} = ${result} ${toCurrency}`; // Tekst for konverteringene
                    
                    conversionHistory.push(conversionText); // Legger til konvertering i historikken
                    displayConversionHistory(); // Oppdaterer visningen av konverteringshistorikken
                    return conversionText; // Returnerer konverteringsteksten
                })
        )
    )
    .then(results => {
        const resultList = results.join('<br>'); // Konverterer resultatene til en tekst med linjeskift
        resultContainer.innerHTML = `Results:<br>${resultList}`; // Viser resultatene i HTML
    })
    .catch(error => console.error('Error:', error)); // Håndterer feil forhåpentligvis
}





// Funksjon for å vise konverteringshistorikk
function displayConversionHistory() {
    const previousList = document.getElementById('previousList'); // Henter elementet for tidligere konverteringer
    previousList.innerHTML = ''; // Tømmer tidligere konverteringsliste

    // Går gjennom konverteringshistorikken og legger til elementer i listen
    for (const conversion of conversionHistory) {
        const listItem = document.createElement('li'); // Oppretter et liste-element

        // Setter teksten til konverteringen i liste-elementet
        listItem.textContent = conversion;

        // Legger til et stjerneikon ved siden av konverteringen
        const starIcon = document.createElement('span'); // Oppretter et span-element
        starIcon.innerHTML = '&#9733;'; // Setter HTML-innhold til stjerne-ikonet (Unicode-tegn) Link: "https://www.htmlsymbols.xyz/star-symbols"
        starIcon.className = 'favorite-icon'; // Legger til CSS-klasse for stjerneikonet
        starIcon.onclick = function() {
            favoriteConversion(conversion); // Legger til konverteringen som favoritt ved klikk på stjerneikonet
        };

        listItem.appendChild(starIcon); // Legger til stjerneikonet i liste-elementet
        previousList.appendChild(listItem); // Legger til liste-elementet i listen for tidligere konverteringer
    }
}





// Funksjon for å legge til konvertering som favoritt
function favoriteConversion(conversionText) {
    if (!favoriteConversions.includes(conversionText)) { // Sjekker om konverteringen allerede er en favoritt
        favoriteConversions.push(conversionText); // Legger til konverteringen som favoritt hvis den ikke allerede er det
        displayFavoriteConversions(); // Oppdaterer visningen av favorittkonverteringer
    }
}

// Funksjon for å vise favorittkonverteringer
function displayFavoriteConversions() {
    const favoriteList = document.getElementById('favoriteList'); // Henter elementet for favorittkonverteringer
    favoriteList.innerHTML = ''; // Tømmer listen for favorittkonverteringer

    for (const conversion of favoriteConversions) {
        const listItem = document.createElement('li'); // Oppretter et liste-element
        listItem.textContent = conversion; // Setter teksten til konverteringen i liste-elementet
        favoriteList.appendChild(listItem); // Legger til liste-elementet i listen for favorittkonverteringer
    }
}

// Legger til en hendelseslytter for dokumentet for å håndtere favorisering av dynamisk tilføyde elementer
document.addEventListener('click', function(event) {
    if (event.target && event.target.className === 'favorite-icon') { // Sjekker om klikket element er et stjerneikon
        const conversionText = event.target.nextSibling.textContent.trim(); // Henter konverteringstekst fra det neste søsken-elementet
        favoriteConversion(conversionText); // Legger til konverteringen som favoritt
    }
});






// Dette var bare et eksperiment ved hjelp av ChatGPT
function updateExchangeRate() {
    const exchangeRateContainer = document.getElementById('exchangeRate'); // Henter elementet for visning av valutakurs

    fetch('https://v6.exchangerate-api.com/v6/latest/USD') // Henter valuta-kurs-data fra API, husk å bytte ut med din, jeg tør ikke å legge ut min :(
        .then(response => response.json()) // Konverterer responsen til JSON-format
        .then(data => {
            const exchangeRates = data.conversion_rates; // Henter valutakursene fra responsen
            const selectedCurrencies = ['USD', 'EUR', 'NOK']; // Liste over valutaer som skal vises
            const exchangeRateText = []; // Tom liste for teksten som viser valutakursene

            for (const fromCurrency of selectedCurrencies) {
                for (const toCurrency of selectedCurrencies) {
                    if (fromCurrency !== toCurrency) {
                        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]; // Beregner valutakursen
                        exchangeRateText.push(`${fromCurrency} til ${toCurrency} - verdi ${rate.toFixed(4)}`); // Legger til tekst i listen
                    }
                }
            }

            exchangeRateContainer.textContent = exchangeRateText.join(' | '); // Oppdaterer visningen av valutakursene i HTML
        })
        .catch(error => console.error('Error:', error)); // Håndterer feil forhåpentligvis
}

// Kaller funksjonen for å sette valutakursen initialt
updateExchangeRate();

// Setter et intervall for å oppdatere valutakursen hvert 60. sekund (juster ved behov)
setInterval(updateExchangeRate, 60000);
