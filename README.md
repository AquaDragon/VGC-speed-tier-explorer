# VGC Speed Tier Explorer

A tool for exploring speed tiers in various Pokémon VGC formats. Optimized for Pokémon Champions.

Currently in development. Some features may not work correctly.

https://aquadragon.github.io/VGC-speed-tier-explorer/

### To-do (not in any order):
- Add boosts from moves: Dragon Dance/Quiver Dance/Scale Shot/Clangorous Soul/Aura Wheel (+1), Shell Smash (+2)
- Add boosts from abilities: Speed Boost (+1), Weak Armor/Surge Surfer/Commander\[SV] (+2)
- Group multiple formes into a single entry if they have the same speed
- Update layout: keep top panel in fixed position, improve visuals, add stat distribution chart
- Allow user to input entries from team paste
- Read smogon usage stats to determine common meta speeds


## Development
- Run `npm run format` to format the code using Prettier.
- Generate smogon usage stats report: `node js/readchaos.js`


## Credits
- Ability data & Pokémon by formats: https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator/
- Item & Pokémon sprite sheet: https://play.pokemonshowdown.com/sprites/
- Pokédex data from Pokémon Showdown