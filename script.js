// Get the HTML elements
var speedTable = document.getElementById("speedTable");
var generateButton = document.getElementById("generateButton");
var sortButton = document.getElementById("sortButton");
var evolutionToggle = document.getElementById("evolutionToggle"); // Get the evolution toggle button
var buttonContainer = document.getElementById("buttonContainer"); // Get the button container

// Initialize sorting direction (descending by default)
var isAscending = false;

// Initialize the evolution filter flag (exclude non-fully evolved by default)
var includeNonFullyEvolved = false;

// Function to sort Pokémon names alphabetically
function sortAlphabetically(data) {
  return Object.keys(data).sort(function(a, b) {
    return a.localeCompare(b);
  });
}

// Function to update button text based on current settings
function updateButtonText() {
  // Update the evolution toggle button text
  evolutionToggle.textContent = includeNonFullyEvolved
    ? "Exclude Non-Fully Evolved"
    : "Include Non-Fully Evolved";

  // Update the sort button text
  sortButton.textContent = isAscending
    ? "Sort Descending"
    : "Sort Ascending";
}

// Function to show the buttons
function showButtons() {
  buttonContainer.style.display = "inline-block"; // Display the button container inline
}

// Function to hide the buttons
function hideButtons() {
  buttonContainer.style.display = "none"; // Hide the button container
}

// Function to generate the Pokémon table based on the evolution filter
function generateTable() {
  // Clear the existing table
  speedTable.innerHTML = '';

  // Create a table header
  var tableHeader = document.createElement("div");
  tableHeader.classList.add("table-row");
  tableHeader.innerHTML = '<div class="table-cell speed">Base Speed</div><div class="table-cell pokemon-names">Pokémon</div>';
  speedTable.appendChild(tableHeader);

  // Create an object to store Pokémon grouped by speed
  var groupedPokemon = {};

  // Sort the Pokémon names alphabetically
  var sortedNames = sortAlphabetically(POKEDEX_SV);

  // Loop through the sorted names and organize Pokémon by speed
  sortedNames.forEach(function(pokemonName) {
    var pokemon = POKEDEX_SV[pokemonName];
    var speed = pokemon.bs.sp;

    // Check if the evolution filter allows including this Pokémon
    if (includeNonFullyEvolved || !pokemon.canEvolve) {
      // Check if the speed already exists in the groupedPokemon object
      if (groupedPokemon[speed]) {
        groupedPokemon[speed].push(pokemonName);
      } else {
        // Create a new entry for this speed
        groupedPokemon[speed] = [pokemonName];
      }
    }
  });

  // Sort the Pokémon by speed based on the sorting direction
  var sortedSpeeds = Object.keys(groupedPokemon).sort(function(a, b) {
    return isAscending ? a - b : b - a;
  });

  // Loop through sorted speeds and create table rows
  sortedSpeeds.forEach(function(speed) {
    var pokemon = groupedPokemon[speed].join(', ');
    var tableRow = document.createElement("div");
    tableRow.classList.add("table-row");
    tableRow.innerHTML = `<div class="table-cell speed">${speed}</div><div class="table-cell pokemon-names">${pokemon}</div>`;
    speedTable.appendChild(tableRow);
  });

  // Update button text based on current settings
  updateButtonText();
  // Show the sort and evolution toggle buttons
  showButtons();
  
  // Change the Generate button to a Reset button
  generateButton.textContent = "Reset";
  generateButton.removeEventListener("click", generateTable); // Remove the generateTable click event listener
  generateButton.addEventListener("click", resetTable); // Add the resetTable click event listener
}

// Function to reset the table to its initial state
function resetTable() {
  speedTable.innerHTML = ''; // Clear the table
  generateButton.textContent = "Generate Speed Tiers"; // Change the button text back to Generate
  generateButton.removeEventListener("click", resetTable); // Remove the resetTable click event listener
  generateButton.addEventListener("click", generateTable); // Add the generateTable click event listener
  // Hide the sort and evolution toggle buttons
  hideButtons();
}

// Add a click event listener to the generate button
generateButton.addEventListener("click", generateTable);

// Function to toggle the evolution filter and regenerate the table
function toggleEvolutionFilter() {
  includeNonFullyEvolved = !includeNonFullyEvolved;
  generateTable();
}

// Function to toggle sorting direction and regenerate the table
function toggleSortDirection() {
  isAscending = !isAscending;
  generateTable();
}

// Add click event listeners to the sortButton and evolutionToggle buttons
sortButton.addEventListener("click", toggleSortDirection);
evolutionToggle.addEventListener("click", toggleEvolutionFilter);

// Initially hide the buttons
hideButtons();
