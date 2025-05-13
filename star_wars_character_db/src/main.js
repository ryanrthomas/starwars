const dialog = document.getElementById("popup-dialog");
const characterTitle = document.getElementById("character-title");
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.getElementById("close-dialog");


const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
    const input = e.target.value;
    console.log(input);
    debouncedCharacterSearch(input);
});

document.addEventListener("DOMContentLoaded", () => {
    fetch(`https://swapi.py4e.com/api/people`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            displayCharacters(data.results);
        })
        .catch(e => {
            console.log(e);
            displayError();
            results.innerText = "The characters you seek are not here";
        }
    );
});

const results = document.getElementById("results");

const searchForCharacter = async (query) => {
    const characterData = await fetch(`https://swapi.py4e.com/api/people?search=${query}`)
        .then(resp => resp.json());

	console.log(characterData);
    displayCharacters(characterData.results)
};

const debouncedCharacterSearch = debounce(searchForCharacter, 500);

const displayCharacters = (characters) => {
    const listOfCharacterNames = characters.map(character => {
        return `<li><a data-url="${character.url}">${character.name}</a></li>`
    }).join("");
    results.innerHTML = `<ul class="characters">${listOfCharacterNames}</ul>`;
    const links = document.querySelectorAll('.characters a');
    links.forEach(link => {
        link.addEventListener('click', () => {
          const characterUrl = link.getAttribute('data-url');
          openCharacterDialog(characterUrl);
        });
      });
};

const openCharacterDialog = (characterApiUrl) => {
    dialog.showModal();
    fetch(characterApiUrl)
        .then(resp => resp.json())
        .then(data => {
            characterTitle.innerText = data.name;
            dialogContent.innerHTML = `
            <p><strong>Height:</strong> ${data.height}</p>
            <p><strong>Mass:</strong> ${data.mass}</p>
            <p><strong>Gender:</strong> ${data.gender}</p>
        `;
        })
        .catch(err => {
            console.log(err);
            displayError();
            dialogContent.innerHTML = 'Failed to load data.';
    });

    

    
};

function displayError() {
    results.innerHTML = "<ul class='characters'><li>The characters you seek are not here</li></ul>"
  }
  