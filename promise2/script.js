// fetch currency data from the API
function fetchCurrencyData(baseCurrency) {
    const apiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid response');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching currency data:', error);
            throw error;
        });
}

//populate currency dropdowns
function populateCurrencyDropdowns(currencies) {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    
    Object.keys(currencies).forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency.toUpperCase();
        fromCurrencySelect.appendChild(option.cloneNode(true));
        toCurrencySelect.appendChild(option);
    });
}

// convert currency
function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    return (amount / fromRate) * toRate;
}

// handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('result');

    fetchCurrencyData(fromCurrency)
        .then(data => {
            const exchangeRates = data[fromCurrency];
            const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
            resultDiv.textContent = `${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`;
        })
        .catch(error => {
            resultDiv.textContent = 'Error: Unable to convert currency. Please try again later.';
        });
}

// startup application and populate currency
function init() {
    const form = document.getElementById('converterForm');
    form.addEventListener('submit', handleFormSubmit);

    fetchCurrencyData('eur')
        .then(data => {
            const currencies = data.eur;
            populateCurrencyDropdowns(currencies);
        })
        .catch(error => {
            console.error('Error initializing currency converter:', error);
        });
}

//wait for DOM to completely load
document.addEventListener('DOMContentLoaded', init);