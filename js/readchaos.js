const fs = require('fs');
const math = require('mathjs');
const { PS_BATTLE_POKEDEX } = require('../imports/ps/pokedex');
const path = require('path');

const filePath = './js/chaos/gen9vgc2025regg-1500.json';
const outputFileName = path.basename(filePath, '.json') + '.txt'; // Use the base filename of the JSON file for the output file
const outputDir = path.dirname(filePath); // original file directory
const outputFilePath = path.join(outputDir, outputFileName); // save to same directory

function calcSpeedStat(base, ivs, evs, nature) {
  const level = 50;
  const natureBoost = nature === '+' ? 1.1 : nature === '-' ? 0.9 : 1;
  return Math.floor((Math.floor(((base * 2 + ivs + Math.floor(evs / 4)) * level) / 100) + 5) * natureBoost);
}

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, rawdata) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(rawdata);

    const totalBattles = jsonData.info['number of battles'];

    let pctRepresentThreshold = 0.2; // %
    let pctUsageThreshold = 5; // %
    let pctMetaUsageThreshold = 1; // %

    if (filePath === 'gen9vgc2024reghbo3-1500.json') {
      pctRepresentThreshold = 0.12; // %
      pctMetaUsageThreshold = 0.6; // %
    }

    // Extract the Pokémon raw counts from jsonData.data
    const data = jsonData.data;

    // Initialize an array to store results
    const results = [];

    // Loop through the Pokémon data
    for (const pkmn in data) {
      if (data.hasOwnProperty(pkmn)) {
        const rawCount = data[pkmn]['Raw count'];
        const spreads = data[pkmn]['Spreads'];

        const pokeUsageEVs = {}; // Initialize pokeUsageEVs for each Pokémon
        const keylist = {}; // Initialize keylist for each speedStat

        // Loop through each spread key and extract nature and EVs
        for (const spreadEntry in spreads) {
          if (spreads.hasOwnProperty(spreadEntry)) {
            const spreadUsage = spreads[spreadEntry];

            // Extract nature and EVs from the spread key (e.g., 'Timid:118/0/116/0/117/156')
            const [nature, evStr] = spreadEntry.split(':');

            let boost = '';

            // Check the nature and assign the appropriate boost
            if (['Jolly', 'Naive', 'Timid', 'Hasty'].includes(nature)) {
              boost = '+';
            } else if (['Brave', 'Quiet', 'Relaxed', 'Sassy'].includes(nature)) {
              boost = '-';
            }

            const evs = evStr.split('/').map(Number); // Convert EVs to numbers
            const speedEV = evs[5]; // Extract the speed stat (last element)

            const psPokeData = PS_BATTLE_POKEDEX[pkmn.toLowerCase().replace(/[-\s]/g, '')];
            const baseStat = psPokeData.baseStats.spe;
            let ivs;
            let key;

            if (boost === '-' && speedEV === 0) {
              ivs = 0; // Assign 0 if the condition is met
              key = `${speedEV}${boost}/0`; // Create a unique key for Speed EV and Boost
            } else {
              ivs = 31; // Otherwise, assign 31
              key = `${speedEV}${boost}`; // Create a unique key for Speed EV and Boost
            }

            const speedStat = calcSpeedStat(baseStat, ivs, speedEV, boost);

            // If the key already exists for the current speedStat, don't add it again
            if (!keylist[speedStat]) {
              keylist[speedStat] = []; // Initialize the list of keys for this speedStat
            }

            // Only add the key if it's not already in the list
            if (!keylist[speedStat].includes(key)) {
              keylist[speedStat].push(key);
            }

            // If the key already exists in pokeUsageEVs, add the current usage to the total
            if (pokeUsageEVs[speedStat]) {
              pokeUsageEVs[speedStat] += spreadUsage;
            } else {
              // Otherwise, initialize the key with the current usage
              pokeUsageEVs[speedStat] = spreadUsage;
            }
          }
        }

        // Percentage Meta Usage (generally top 100 in >1%)
        const pctMetaUsage = (rawCount / (totalBattles * 2)) * 100;

        const evUsage = Object.values(pokeUsageEVs); // Get all values from the "Spreads"
        const evUsageSum = math.sum(evUsage);

        // Collect the data for each unique combination of Speed EV and Boost
        for (const speedStat in pokeUsageEVs) {
          if (pokeUsageEVs.hasOwnProperty(speedStat)) {
            const totalUsage = pokeUsageEVs[speedStat];
            const rawUsage = (totalUsage / evUsageSum) * rawCount;
            const pctUsage = (totalUsage / evUsageSum) * 100;

            const pctRepresent = (((pctUsage / 100) * pctMetaUsage) / 100) * 100;

            if (
              pctRepresent > pctRepresentThreshold &&
              pctUsage > pctUsageThreshold &&
              pctMetaUsage > pctMetaUsageThreshold
            ) {
              // Sort the keylist in descending order (largest keys first)
              const sortedKeylist = keylist[speedStat].sort((a, b) => b.localeCompare(a)); // Sort in descending order

              // Store the result in an array for later sorting
              results.push({
                speedStat,
                pkmn,
                keylist: sortedKeylist.join(', '),
                rawUsage: rawUsage.toFixed(0),
                pctUsage: pctUsage.toFixed(1),
                pctMetaUsage: pctMetaUsage.toFixed(3),
                pctRepresent: pctRepresent.toFixed(2),
              });
            }
          }
        }
      }
    }

    // Sort the results based on the `speedStat` in descending order
    results.sort((a, b) => b.speedStat - a.speedStat); // Sort by `speedStat` descending

    // Create the output text string
    let outputText = `Results for ${path.basename(filePath)}:

Total Battles: ${totalBattles}
Include if speed stat usage is above: ${pctUsageThreshold}%
Include if pokemon usage is above: ${pctMetaUsageThreshold}%
Include if overall combined stat usage is above: ${pctRepresentThreshold}%

`;
    results.forEach((result) => {
      outputText += `${result.speedStat} ${result.pkmn} [${result.keylist}] --- ${result.pctRepresent}% [${result.pctUsage}% of ${result.pctMetaUsage}%] (Count = ${result.rawUsage})\n`;
    });

    // Write the result to a file
    fs.writeFileSync(outputFilePath, outputText, 'utf8');
    console.log(`Results saved to ${outputFilePath}`);
  } catch (parseErr) {
    console.error(`Error parsing JSON: ${parseErr}`);
  }
});
