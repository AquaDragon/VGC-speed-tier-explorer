// Get HTML elements
var displayTable = document.getElementById('displayTable');

// Get HTML buttons
var btnUpdateTable = document.getElementById('btnUpdateTable');
var btnResetTable = document.getElementById('btnResetTable');
var btnSortAscending = document.getElementById('btnSortAscending');
var btnFilterNonFullyEvolved = document.getElementById('btnFilterNonFullyEvolved');

var cboxFastBST = document.getElementById('cboxFastBST');
var cboxSlowBST = document.getElementById('cboxSlowBST');

// Initialize initial sort orders & display filters
var isAscending = false; // descending by default
var hasNonFullyEvolved = false; // exclude non-fully evolved by default
var setFastBST = parseInt(selectFastBST.value, 10);
var setSlowBST = parseInt(selectSlowBST.value, 10);

// Function to reset the table to its initial state
function defaultTableRules() {
  isAscending = false;
  hasNonFullyEvolved = false;
  updateButtonText();

  selectFormat.value = 'FORMAT_SV_REGULATION_E';

  cboxFastBST.checked = true;
  selectFastBST.value = '90';
  setFastBST = parseInt(selectFastBST.value, 10);

  cboxSlowBST.checked = true;
  selectSlowBST.value = '70';
  setSlowBST = parseInt(selectSlowBST.value, 10);

  clearTable();
}

function calcSpeedStat(base, ivs, evs, nature) {
  const level = 50;
  const natureBoost = nature === '+' ? 1.1 : nature === '-' ? 0.9 : 1;
  return Math.floor(
    (Math.floor(((base * 2 + ivs + Math.floor(evs / 4)) * level) / 100) + 5) * natureBoost
  );
}

// Update the button texts based on current display settings
function updateButtonText() {
  btnFilterNonFullyEvolved.textContent = hasNonFullyEvolved
    ? 'Exclude Non-Fully Evolved'
    : 'Include Non-Fully Evolved';
  btnSortAscending.textContent = isAscending ? 'Sort Descending' : 'Sort Ascending';
}

function generateTableEntry(pokemonName, baseStat, ivs, evs, nature, item) {
  return {
    name: pokemonName,
    baseStat: baseStat,
    iv: ivs,
    ev: evs,
    nature: nature,
    item: item,
    stat: calcSpeedStat(baseStat, ivs, evs, nature),
  };
}

// Function to generate data for each Pokémon and return an array of objects
function generateTableData() {
  const tableData = [];
  const selectedFormat = formatOptions.find((option) => option.value === selectFormat.value).var;
  const format = selectedFormat ? sortAlphaGetKeys(selectedFormat) : sortAlphaGetKeys(POKEDEX_SV);

  // Loop through the sorted names and generate data for each Pokémon
  format.forEach(function (pokemonName) {
    const pokemon = POKEDEX_SV_NATDEX[pokemonName];

    if (hasNonFullyEvolved || !pokemon.canEvolve) {
      const baseStat = pokemon.bs.sp;
      let ivs, evs, nature, stat, pokemonData;

      // Neutral speed (always populate)
      pokemonData = generateTableEntry(pokemonName, baseStat, 31, 0, '', null);
      tableData.push(pokemonData);

      // Slow speed
      if (baseStat <= setSlowBST && cboxSlowBST.checked) {
        pokemonData = generateTableEntry(pokemonName, baseStat, 0, 0, '-', null);
        tableData.push(pokemonData);
      }

      // Fast speed
      if (baseStat >= setFastBST && cboxFastBST.checked) {
        pokemonData = generateTableEntry(pokemonName, baseStat, 31, 252, '+', null);
        tableData.push(pokemonData);
      }
    }
  });

  return tableData;
}

// Function to generate the Pokémon table based on sort order & filters
function generateTable() {
  // Clear the existing table
  displayTable.innerHTML = '';

  // Create a table header
  var tableHeader = document.createElement('div');
  tableHeader.classList.add('table-row');
  tableHeader.innerHTML = `
    <div class="table-cell speed-header">Speed</div>
    <div class="table-cell">BST</div>
    <div class="table-cell">IVs</div>
    <div class="table-cell">EVs</div>
    <div class="table-cell">Item</div>
    <div class="table-cell poke-names">Pokémon</div>
  `;
  displayTable.appendChild(tableHeader);

  // Generate the Pokémon data
  const pokemonData = generateTableData(); // Pass sortedNames as a parameter

  // Sort the Pokémon data based on the sorting direction
  pokemonData.sort(function (a, b) {
    return isAscending ? a.stat - b.stat : b.stat - a.stat;
  });

  // Group Pokémon with identical baseStat, iv, and evs
  const groupedPokemon = {};
  pokemonData.forEach(function (poke) {
    const key = `${poke.baseStat}-${poke.iv}-${poke.ev}`;
    if (!groupedPokemon[key]) {
      groupedPokemon[key] = [];
    }
    groupedPokemon[key].push(poke);
  });

  // Loop through grouped Pokémon and create table rows
  for (const key in groupedPokemon) {
    if (groupedPokemon.hasOwnProperty(key)) {
      const pokemonGroup = groupedPokemon[key];
      const stat = pokemonGroup[0].stat;
      const pokemonNames = pokemonGroup.map((poke) => poke.name).join(', ');

      var tableRow = document.createElement('div');
      tableRow.classList.add('table-row');
      tableRow.innerHTML = `
        <div class="table-cell speed">${stat}</div>
        <div class="table-cell">${pokemonGroup[0].baseStat}</div>
        <div class="table-cell">${pokemonGroup[0].iv}</div>
        <div class="table-cell">${pokemonGroup[0].ev}${pokemonGroup[0].nature}</div>
        <div class="table-cell">
          ${
            pokemonGroup[0].item !== null && pokemonGroup[0].item !== ''
              ? pokemonGroup[0].item
              : '-'
          }
        </div>
        <div class="table-cell poke-names">${pokemonNames}</div>`;
      displayTable.appendChild(tableRow);
    }
  }

  // Update button text based on current settings
  updateButtonText();

  // Change the Generate button to a Reset button
  btnUpdateTable.textContent = 'Clear Table';
  btnUpdateTable.removeEventListener('click', generateTable); // Remove the generateTable click event listener
  btnUpdateTable.addEventListener('click', clearTable); // Add the btnResetTable click event listener
}

// Function to clear the table
function clearTable() {
  displayTable.innerHTML = ''; // Clear the table
  btnUpdateTable.textContent = 'Generate Table'; // Change the button text back to Generate
  btnUpdateTable.removeEventListener('click', clearTable); // Remove the btnResetTable click event listener
  btnUpdateTable.addEventListener('click', generateTable); // Add the generateTable click event listener
}

// Add a click event listener to the generate button
btnUpdateTable.addEventListener('click', generateTable);
btnResetTable.addEventListener('click', defaultTableRules);

// Function to toggle the evolution filter and update table
function toggleEvolutionFilter() {
  hasNonFullyEvolved = !hasNonFullyEvolved;
  generateTable();
}

// Function to toggle sorting direction and update table
function toggleSortDirection() {
  isAscending = !isAscending;
  generateTable();
}

// Add click event listeners to the btnSortAscending and btnFilterNonFullyEvolved buttons
btnSortAscending.addEventListener('click', toggleSortDirection);
btnFilterNonFullyEvolved.addEventListener('click', toggleEvolutionFilter);

// Event listeners for checkboxes
cboxFastBST.addEventListener('change', function () {
  generateTableData();
  generateTable();
});

cboxSlowBST.addEventListener('change', function () {
  generateTableData();
  generateTable();
});

// Event listeners for select value changes
selectFormat.addEventListener('change', function () {
  generateTableData();
  generateTable();
});

selectFastBST.addEventListener('change', function () {
  setFastBST = parseInt(selectFastBST.value, 10);
  generateTableData();
  generateTable();
});

selectSlowBST.addEventListener('change', function () {
  setSlowBST = parseInt(selectSlowBST.value, 10);
  generateTableData();
  generateTable();
});

updateButtonText();
