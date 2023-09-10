// Get HTML elements
var displayTable = document.getElementById("displayTable");
var buttonContainer = document.getElementById("buttonContainer");

// Get HTML buttons
var updateTable = document.getElementById("updateTable");
var resetTable = document.getElementById("resetTable");
var sortAscending = document.getElementById("sortAscending");
var filterNonFullyEvolved = document.getElementById("filterNonFullyEvolved");

// Initialize initial sort orders & display filters
var isAscending = false; // descending by default
var includeNonFullyEvolved = false; // exclude non-fully evolved by default
var setFastBST = 90; // BST above which IV=31, EV=252 & nature is boosting
var setSlowBST = 70; // BST below which IV=0, EV=0 & nature is hindering

function calcSpeedStat(base, ivs, evs, nature) {
  const level = 50;
  const natureBoost = nature === '+' ? 1.1 : nature === '-' ? 0.9 : 1;

  return Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * natureBoost);
}

function sortAlphabetically(data) {
  return Object.keys(data).sort(function (a, b) {
    return a.localeCompare(b);
  });
}

// Update the button texts based on current display settings
function updateButtonText() {
  filterNonFullyEvolved.textContent = includeNonFullyEvolved ? "Exclude Non-Fully Evolved" : "Include Non-Fully Evolved";
  sortAscending.textContent = isAscending ? "Sort Descending" : "Sort Ascending";
}

function addBulletPoints() {
  const buttonContainer = document.getElementById("buttonContainer");

  const slowBSTBullet = document.createElement("p");
  slowBSTBullet.innerHTML = `Pokemon with base speeds below <strong>${setSlowBST}</strong> are included in this list.`;

  const fastBSTBullet = document.createElement("p");
  fastBSTBullet.innerHTML = `Pokemon with base speeds above <strong>${setFastBST}</strong> are included in this list.`;

  buttonContainer.appendChild(slowBSTBullet);
  buttonContainer.appendChild(fastBSTBullet);
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
  const sortedDexSV = sortAlphabetically(POKEDEX_SV);

  // Loop through the sorted names and generate data for each Pokémon
  sortedDexSV.forEach(function (pokemonName) {
    const pokemon = POKEDEX_SV[pokemonName];

    // Check if the filters allow including this Pokémon
    if (includeNonFullyEvolved || !pokemon.canEvolve) {
      const baseStat = pokemon.bs.sp;
      let ivs, evs, nature, stat, pokemonData;

      // Neutral speed (always populate)
      pokemonData = generateTableEntry(pokemonName, baseStat, 31, 0, '', null);
      tableData.push(pokemonData);

      // Slow speed
      if (baseStat <= setSlowBST) {
        pokemonData = generateTableEntry(pokemonName, baseStat, 0, 0, '-', null);
        tableData.push(pokemonData);
      } 

      // Fast speed
      if (baseStat >= setFastBST) {
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
  var tableHeader = document.createElement("div");
  tableHeader.classList.add("table-row");
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

      var tableRow = document.createElement("div");
      tableRow.classList.add("table-row");
      tableRow.innerHTML = `
        <div class="table-cell speed">${stat}</div>
        <div class="table-cell">${pokemonGroup[0].baseStat}</div>
        <div class="table-cell">${pokemonGroup[0].iv}</div>
        <div class="table-cell">${pokemonGroup[0].ev}${pokemonGroup[0].nature}</div>
        <div class="table-cell">
          ${pokemonGroup[0].item !== null && pokemonGroup[0].item !== '' ? pokemonGroup[0].item : '-'}
        </div>
        <div class="table-cell poke-names">${pokemonNames}</div>`;
      displayTable.appendChild(tableRow);
    }
  }

  // Update button text based on current settings
  updateButtonText();

  // Change the Generate button to a Reset button
  updateTable.textContent = "Clear Table";
  updateTable.removeEventListener("click", generateTable); // Remove the generateTable click event listener
  updateTable.addEventListener("click", clearTable); // Add the resetTable click event listener
}

// Function to clear the table
function clearTable() {
  displayTable.innerHTML = ''; // Clear the table
  updateTable.textContent = "Generate Table"; // Change the button text back to Generate
  updateTable.removeEventListener("click", clearTable); // Remove the resetTable click event listener
  updateTable.addEventListener("click", generateTable); // Add the generateTable click event listener
}

// Function to reset the table to its initial state
function resetTableRules() {
  // clearTable();
  // updateTable.removeEventListener("click", resetTable); // Remove the resetTable click event listener
  // updateTable.addEventListener("click", generateTable); // Add the generateTable click event listener
}

// Add a click event listener to the generate button
updateTable.addEventListener("click", generateTable);
resetTable.addEventListener("click", resetTableRules);

// Function to toggle the evolution filter and update table
function toggleEvolutionFilter() {
  includeNonFullyEvolved = !includeNonFullyEvolved;
  generateTable();
}

// Function to toggle sorting direction and update table
function toggleSortDirection() {
  isAscending = !isAscending;
  generateTable();
}

// Add click event listeners to the sortAscending and filterNonFullyEvolved buttons
sortAscending.addEventListener("click", toggleSortDirection);
filterNonFullyEvolved.addEventListener("click", toggleEvolutionFilter);

updateButtonText();
addBulletPoints();
