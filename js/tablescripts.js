// Get HTML elements
var displayTable = document.getElementById('displayTable');

// Get HTML buttons
var btnResetTable = document.getElementById('btnResetTable');
var btnDeselectAll = document.getElementById('btnDeselectAll');
var btnSortAscending = document.getElementById('btnSortAscending');
var btnFilterNonFullyEvolved = document.getElementById('btnFilterNonFullyEvolved');

var cboxFastBST = document.getElementById('cboxFastBST');
var cboxSlowBST = document.getElementById('cboxSlowBST');
var cboxChoiceScarf = document.getElementById('cboxChoiceScarf');
var cboxIronBall = document.getElementById('cboxIronBall');
var cboxAbilities = document.getElementById('cboxAbilities');
var cboxTailwind = document.getElementById('cboxTailwind');
var cboxTailwindMax = document.getElementById('cboxTailwindMax');

// Initialize initial sort orders & display filters
var isAscending = false; // descending by default
var hasNonFullyEvolved = false; // exclude non-fully evolved by default
var setFastBST = parseInt(selectFastBST.value, 10);
var setSlowBST = parseInt(selectSlowBST.value, 10);
var setChoiceScarfBST = parseInt(selectChoiceScarfBST.value, 10);
var setIronBallBST = parseInt(selectIronBallBST.value, 10);
var setTailwindBST = parseInt(selectTailwindBST.value, 10);
var setTailwindMaxBST = parseInt(selectTailwindBST.value, 10);

const abilityList = ['Chlorophyll', 'Swift Swim', 'Sand Rush', 'Slush Rush', 'Unburden']; // x2
const abParadox = ['Quark Drive', 'Protosynthesis']; // x1.5 with Booster Energy

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

  cboxChoiceScarf.checked = true;
  selectChoiceScarfBST.value = '75';
  setChoiceScarfBST = parseInt(selectChoiceScarfBST.value, 10);

  cboxIronBall.checked = true;
  selectIronBallBST.value = '50';
  setIronBallBST = parseInt(selectIronBallBST.value, 10);

  cboxAbilities.checked = true;

  cboxTailwind.checked = true;
  selectTailwindBST.value = '65';
  setTailwindBST = parseInt(selectTailwindBST.value, 10);

  cboxTailwindMax.checked = true;
  selectTailwindMaxBST.value = '65';
  setTailwindMaxBST = parseInt(selectTailwindMaxBST.value, 10);

  updateTable();
}

// Deselecting all rules is equivalent to showing neutral base speed table
function deselectAllRules() {
  cboxFastBST.checked = false;
  cboxSlowBST.checked = false;
  cboxChoiceScarf.checked = false;
  cboxIronBall.checked = false;
  cboxAbilities.checked = false;
  cboxTailwind.checked = false;
  cboxTailwindMax.checked = false;

  updateTable();
}

function calcSpeedStat(base, ivs, evs, nature) {
  const level = 50;
  const natureBoost = nature === '+' ? 1.1 : nature === '-' ? 0.9 : 1;
  return Math.floor((Math.floor(((base * 2 + ivs + Math.floor(evs / 4)) * level) / 100) + 5) * natureBoost);
}

// Update the button texts based on current display settings
function updateButtonText() {
  btnFilterNonFullyEvolved.textContent = hasNonFullyEvolved ? 'Exclude Non-Fully Evolved' : 'Include Non-Fully Evolved';
  btnSortAscending.textContent = isAscending ? 'Sort Descending' : 'Sort Ascending';
}

function generateTableEntry(pokeName, baseStat, ivs, evs, nature, item, ability, field) {
  let speedStat = calcSpeedStat(baseStat, ivs, evs, nature);

  if (['Choice Scarf', 'Booster Energy'].includes(item)) {
    speedStat = Math.floor(speedStat * 1.5);
  } else if (item === 'Iron Ball') {
    speedStat = Math.floor(speedStat * 0.5);
  }

  if (abilityList.includes(ability)) {
    speedStat = speedStat * 2;
  }

  if (field === 'Tailwind') {
    speedStat = speedStat * 2;
  }

  return {
    name: pokeName,
    baseStat: baseStat,
    iv: ivs,
    ev: evs,
    nature: nature,
    item: item,
    ability: ability,
    field: field,
    stat: speedStat,
  };
}

// Function to generate data for each Pokémon and return an array of objects
function generateTableData() {
  const tableData = [];
  const selectedFormat = formatOptions.find((option) => option.value === selectFormat.value).var;
  const format = selectedFormat ? sortAlphaGetKeys(selectedFormat) : sortAlphaGetKeys(POKEDEX_SV);

  // Loop through the sorted names and generate data for each Pokémon
  format.forEach(function (poke) {
    const pokemon = PS_BATTLE_POKEDEX[toID(poke)] || PS_BATTLE_POKEDEX[toID(DMGCALC_TO_SHOWDOWN_NAMES[poke])];
    const pokeName = pokemon.name;

    if (hasNonFullyEvolved || pokemon.evos === undefined) {
      const baseStat = pokemon.baseStats.spe;
      let ivs, evs, nature, stat, pokemonData;
      const pokeAbility = Object.values(pokemon.abilities);

      // Neutral speed (always populate)
      pokemonData = generateTableEntry(pokeName, baseStat, 31, 0, '', null, null, null);
      tableData.push(pokemonData);

      // BST: Fast
      if (baseStat >= setFastBST && cboxFastBST.checked) {
        pokemonData = generateTableEntry(pokeName, baseStat, 31, 252, '+', null, null, null);
        tableData.push(pokemonData);
      }

      // BST: Slow
      if (baseStat <= setSlowBST && cboxSlowBST.checked) {
        pokemonData = generateTableEntry(pokeName, baseStat, 0, 0, '-', null, null, null);
        tableData.push(pokemonData);
      }

      // Item: Choice Scarf / Booster Energy (paradox mons)
      if (baseStat >= setChoiceScarfBST && cboxChoiceScarf.checked) {
        if (pokeAbility.some((ability) => abParadox.includes(ability))) {
          pokemonData = generateTableEntry(pokeName, baseStat, 31, 252, '+', 'Booster Energy', null, null);
        } else {
          pokemonData = generateTableEntry(pokeName, baseStat, 31, 252, '+', 'Choice Scarf', null, null);
        }
        tableData.push(pokemonData);
      }

      // Item: Iron Ball
      if (baseStat <= setIronBallBST && cboxIronBall.checked) {
        pokemonData = generateTableEntry(pokeName, baseStat, 0, 0, '-', 'Iron Ball', null, null);
        tableData.push(pokemonData);
      }

      // Abilities: Weather boost
      pokeAbility.forEach((ab) => {
        if (cboxAbilities.checked && abilityList.includes(ab)) {
          // Max speed
          const pokemonData1 = generateTableEntry(pokeName, baseStat, 31, 252, '+', null, ab, null);
          tableData.push(pokemonData1);

          // 252 speed EVs, neutral nature
          const pokemonData2 = generateTableEntry(pokeName, baseStat, 31, 252, '', null, ab, null);
          tableData.push(pokemonData2);
        }
      });

      // Field: Tailwind  (Note: exclude mons that gain x2 speed from ability)
      if (
        baseStat >= setTailwindBST &&
        cboxTailwind.checked &&
        !pokeAbility.some((ability) => abilityList.includes(ability))
      ) {
        pokemonData = generateTableEntry(pokeName, baseStat, 31, 0, '', null, null, 'Tailwind');
        tableData.push(pokemonData);
      }

      if (
        baseStat >= setTailwindMaxBST &&
        cboxTailwindMax.checked &&
        !pokeAbility.some((ability) => abilityList.includes(ability))
      ) {
        pokemonData = generateTableEntry(pokeName, baseStat, 31, 252, '+', null, null, 'Tailwind');
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
    <div class="table-cell mods">Modifier</div>
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
    const key = `${poke.baseStat}-${poke.iv}-${poke.ev}-${poke.nature}-${poke.item}-${poke.ability}-${poke.field}`;
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
      const mods = [pokemonGroup[0].ability, pokemonGroup[0].field].filter(Boolean).join(', ');

      const pokeEntries = pokemonGroup
        .map((poke) => {
          const types = PS_BATTLE_POKEDEX[toID(poke.name)].types;
          const type1 = typeColors[types[0]];
          const type2 = types.length > 1 ? typeColors[types[1]] : type1;
          return `
          <div class="poke-entry-outer">
            <div class="poke-entry" style="background-color: ${type1}10; border-color: ${type2}50;">
              <span class="minisprite-icon" style="${getMiniSpriteIcon(poke.name)}" title="${poke.name}"></span>
              <span class="poke-name">${poke.name}</span>
            </div>
          </div>`;
        })
        .join('');

      var tableRow = document.createElement('div');
      tableRow.classList.add('table-row');
      tableRow.innerHTML = `
        <div class="table-cell speed">${stat}</div>
        <div class="table-cell">${pokemonGroup[0].baseStat}</div>
        <div class="table-cell">${pokemonGroup[0].iv}</div>
        <div class="table-cell">${pokemonGroup[0].ev}${pokemonGroup[0].nature}</div>
        <div class="table-cell">
          <span class='item-icon' style="${getItemIcon(pokemonGroup[0].item)}" title="${pokemonGroup[0].item}"></span>
        </div>
        <div class="table-cell mods">${mods ? mods : '-'}</div>
        <div class="table-cell poke-names">${pokeEntries}</div>`;
      displayTable.appendChild(tableRow);
    }
  }

  // Update button text based on current settings
  updateButtonText();
}

function updateTable() {
  generateTableData();
  generateTable();
}

// Function to toggle the evolution filter and update table
function toggleEvolutionFilter() {
  hasNonFullyEvolved = !hasNonFullyEvolved;
  updateTable();
}

// Function to toggle sorting direction and update table
function toggleSortDirection() {
  isAscending = !isAscending;
  updateTable();
}

// Click event listeners for buttons
btnResetTable.addEventListener('click', defaultTableRules);
btnDeselectAll.addEventListener('click', deselectAllRules);

btnSortAscending.addEventListener('click', toggleSortDirection);
btnFilterNonFullyEvolved.addEventListener('click', toggleEvolutionFilter);

// Event listeners for checkboxes
function cboxEventListener(cbox) {
  cbox.addEventListener('change', function () {
    updateTable();
  });
}

cboxEventListener(cboxFastBST);
cboxEventListener(cboxSlowBST);
cboxEventListener(cboxChoiceScarf);
cboxEventListener(cboxIronBall);
cboxEventListener(cboxAbilities);
cboxEventListener(cboxTailwind);
cboxEventListener(cboxTailwindMax);

// Event listeners for select value changes
function addChangeListener(s, updateFunction) {
  s.addEventListener('change', function () {
    updateFunction(parseInt(s.value, 10));
    updateTable();
  });
}

addChangeListener(selectFormat, () => {});
addChangeListener(selectFastBST, (value) => (setFastBST = value));
addChangeListener(selectSlowBST, (value) => (setSlowBST = value));
addChangeListener(selectChoiceScarfBST, (value) => (setChoiceScarfBST = value));
addChangeListener(selectIronBallBST, (value) => (setIronBallBST = value));
addChangeListener(selectTailwindBST, (value) => (setTailwindBST = value));
addChangeListener(selectTailwindMaxBST, (value) => (setTailwindMaxBST = value));

updateButtonText();
updateTable();
