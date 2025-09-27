const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokeDisplayContainer = document.querySelector('.display') // Mudei para querySelector

const maxRecords = 151
const limit = 10
let offset = 0;

let currentSlot = 1;
let slot1Content = null;
let slot2Content = null;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-name="${pokemon.name}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function convertPokemonToDisplay(pokemon, slotNumber) {

    function calculateStatPercentage(statValue) {
        const maxStat = 255;
        return Math.min((statValue / maxStat) * 100, 100);
    }
    
    function formatPokemonNumber(number) {
        return `#${number.toString().padStart(3, '0')}`;
    }

    return `
        <div class="pokemon-slot slot-${slotNumber} ${pokemon.type}">
            <div class="pokemonDisplay">
                <span class="displayName">${pokemon.name}</span>
                <span class="displayNumber">${formatPokemonNumber(pokemon.number)}</span>
                <div class="displayDetail">
                    <ul>
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ul>
                    <img src="${pokemon.photo}" alt="${pokemon.name} image">
                </div>
            </div>
            <div class="statsBar">
                <span class="basicStatus">Basic Status</span>
                <div class="stat-row">
                    <span class="stat-name">HP</span>
                    <span class="stat-value">${pokemon.stats.hp}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${calculateStatPercentage(pokemon.stats.hp)}%"></div>
                    </div>
                </div>
                <div class="stat-row">
                    <span class="stat-name">Attack</span>
                    <span class="stat-value">${pokemon.stats.attack}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${calculateStatPercentage(pokemon.stats.attack)}%"></div>
                    </div>
                </div>
                <div class="stat-row">
                    <span class="stat-name">Defense</span>
                    <span class="stat-value">${pokemon.stats.defense}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${calculateStatPercentage(pokemon.stats.defense)}%"></div>
                    </div>
                </div>
                <div class="stat-row">
                    <span class="stat-name">Sp. Atk</span>
                    <span class="stat-value">${pokemon.stats.specialAttack}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${calculateStatPercentage(pokemon.stats.specialAttack)}%"></div>
                    </div>
                </div>
                <div class="stat-row">
                    <span class="stat-name">Sp. Def</span>
                    <span class="stat-value">${pokemon.stats.specialDefense}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${calculateStatPercentage(pokemon.stats.specialDefense)}%"></div>
                    </div>
                </div>
                <div class="stat-row">
                    <span class="stat-name">Speed</span>
                    <span class="stat-value">${pokemon.stats.speed}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${calculateStatPercentage(pokemon.stats.speed)}%"></div>
                    </div>
                </div>
                <div class="total-stats">
                    <span class="total-label">Total: </span>
                    <span class="total-value">${
                        pokemon.stats.hp +
                        pokemon.stats.attack +
                        pokemon.stats.defense +
                        pokemon.stats.specialAttack +
                        pokemon.stats.specialDefense +
                        pokemon.stats.speed
                    }</span>
                </div>
            </div>
        </div>
    `
}

// HTML inicial com dois slots vazios
pokeDisplayContainer.innerHTML = `
    <div class="pokemon-slots-container">
        <div class="slot-1 empty-slot"></div>
        <div class="slot-2 empty-slot"></div>
    </div>
`

pokemonList.addEventListener('click', function(event) {
    const listItem = event.target.closest('li.pokemon');
    if (!listItem) return;
    
    const pokemonName = listItem.dataset.pokemonName;
    
    pokeApi.getPokemonByName(pokemonName).then((pokemonDetail) => {
        // Alterna entre os slots
        if (currentSlot === 1) {
            slot1Content = convertPokemonToDisplay(pokemonDetail, 1);
            currentSlot = 2;
        } else {
            slot2Content = convertPokemonToDisplay(pokemonDetail, 2);
            currentSlot = 1;
        }
        
        // Atualiza a exibição com ambos os slots
        updateDisplay();
    });
});

function updateDisplay() {
    const slot1Element = document.querySelector('.slot-1');
    const slot2Element = document.querySelector('.slot-2');
    
    // Atualiza o slot 1
    if (slot1Content) {
        slot1Element.outerHTML = slot1Content;
    } else {
        slot1Element.innerHTML = '';
        slot1Element.className = 'slot-1 empty-slot';
    }
    
    // Atualiza o slot 2
    if (slot2Content) {
        slot2Element.outerHTML = slot2Content;
    } else {
        slot2Element.innerHTML = '';
        slot2Element.className = 'slot-2 empty-slot';
    }
}