# VGC Speed Tier Explorer

A tool for exploring speed tiers in various Pokémon VGC formats. Optimized for Pokémon Scarlet & Violet.

Currently in development and some features may not work correctly.

https://aquadragon.github.io/VGC-speed-tier-explorer/

### To-do (not in any order):
- Add stage boosts: Dragon Dance/Quiver Dance (+1), Commander (+2)
- Group regional formes into a single entry if they have the same speed
- Update visuals: buttons & layout
- Allow user to edit table entries (add/remove uncommon situations)
- Visual indicator for weighted lists (e.g. top 50/100 usage)
- Read smogon usage stats to determine most common speeds
- Add stat distribution chart


## Development
- Run `npm run format` to format the code using Prettier.
- Generate smogon usage stats report: `node js/readchaos.js`


## Credits
- Ability data & Pokémon by formats: https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator/
- Item & Pokémon sprite sheet: https://play.pokemonshowdown.com/sprites/
- Pokédex data from Pokémon Showdown