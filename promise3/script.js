
const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const resultDiv = document.getElementById('result');


searchBtn.addEventListener('click', searchWord);
wordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWord();
    }
});

//search word
function searchWord() {
    const word = wordInput.value.trim();
    if (word) {
        fetchWordDefinition(word);
    }
}

//fetch word definition from the API
function fetchWordDefinition(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResult(data);
        })
        .catch(error => {
            displayError('An error occurred while fetching the data. Please try again later.');
            console.error('Error:', error);
        });
}

//isplay the result
function displayResult(data) {
    resultDiv.innerHTML = '';

    if (Array.isArray(data)) {
        const wordData = data[0];
        const wordElement = createWordElement(wordData);
        resultDiv.appendChild(wordElement);
    } else {
        displayError(data.message || 'No definitions found.');
    }
}

//create word element
function createWordElement(wordData) {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word-container');

    const wordTitle = document.createElement('h2');
    wordTitle.textContent = wordData.word;
    wordElement.appendChild(wordTitle);

    if (wordData.phonetic) {
        const phonetic = document.createElement('p');
        phonetic.textContent = wordData.phonetic;
        wordElement.appendChild(phonetic);
    }

    if (wordData.meanings && wordData.meanings.length > 0) {
        const meaningsContainer = createMeaningsContainer(wordData.meanings);
        wordElement.appendChild(meaningsContainer);
    }

    return wordElement;
}

// create meanings container
function createMeaningsContainer(meanings) {
    const meaningsContainer = document.createElement('div');
    meaningsContainer.classList.add('meanings-container');

    meanings.forEach(meaning => {
        const meaningElement = createMeaningElement(meaning);
        meaningsContainer.appendChild(meaningElement);
    });

    return meaningsContainer;
}

// create meaning element
function createMeaningElement(meaning) {
    const meaningElement = document.createElement('div');
    meaningElement.classList.add('meaning');

    const partOfSpeech = document.createElement('h3');
    partOfSpeech.classList.add('part-of-speech');
    partOfSpeech.textContent = meaning.partOfSpeech;
    meaningElement.appendChild(partOfSpeech);

    if (meaning.definitions && meaning.definitions.length > 0) {
        const definitionsList = createDefinitionsList(meaning.definitions);
        meaningElement.appendChild(definitionsList);
    }

    return meaningElement;
}

//create definitions list
function createDefinitionsList(definitions) {
    const definitionsList = document.createElement('ol');

    definitions.forEach(def => {
        const definitionItem = document.createElement('li');
        definitionItem.classList.add('definition');

        const definition = document.createElement('p');
        definition.textContent = def.definition;
        definitionItem.appendChild(definition);

        if (def.example) {
            const example = document.createElement('p');
            example.classList.add('example');
            example.textContent = `Example: ${def.example}`;
            definitionItem.appendChild(example);
        }

        definitionsList.appendChild(definitionItem);
    });

    return definitionsList;
}

// display error message
function displayError(message) {
    const errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    resultDiv.appendChild(errorElement);
}