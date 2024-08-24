
//fetch data from the Postal PIN Code API
function fetchPostalData(searchType, searchValue) {
    const apiUrl = `https://api.postalpincode.in/${searchType}/${searchValue}`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data[0].Status === 'Error') {
                throw new Error(data[0].Message);
            }
            return data[0];
        });
}

//display results on the webpage
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = '';

    const message = document.createElement('p');
    message.textContent = data.Message;
    resultContent.appendChild(message);

    if (data.PostOffice && data.PostOffice.length > 0) {
        data.PostOffice.forEach(office => {
            const card = document.createElement('div');
            card.classList.add('result-card');

            const name = document.createElement('h3');
            name.textContent = office.Name;
            card.appendChild(name);

            const details = [
                `Branch Type: ${office.BranchType}`,
                `Delivery Status: ${office.DeliveryStatus}`,
                `District: ${office.District}`,
                `State: ${office.State}`
            ];

            details.forEach(detail => {
                const p = document.createElement('p');
                p.textContent = detail;
                card.appendChild(p);
            });

            resultContent.appendChild(card);
        });
    }

    resultsDiv.classList.remove('d-none');
}

document.getElementById('postalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('resultContent');

    resultContent.innerHTML = '';
    resultsDiv.classList.add('d-none');

    fetchPostalData(searchType.value, searchInput.value)
        .then(displayResults)
        .catch(error => {
            resultContent.innerHTML = `<p class="error-message">${error.message}</p>`;
            resultsDiv.classList.remove('d-none');
        });
});