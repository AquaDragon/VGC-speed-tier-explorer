/*
    Used to determine the index number of each sprite in their respective sprite sheets.
    Source: play.pokemonshowdown.com/js/battledata.js
    23 Sep 2023
*/
function toID(text) {
  var _text, _text2;

  if ((_text = text) != null && _text.id) {
    text = _text.id;
  } else if ((_text2 = text) != null && _text2.userid) {
    text = _text2.userid;
  }

  if (typeof text !== 'string' && typeof text !== 'number') {
    return '';
  }

  return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getItemIcon(item) {
  var _item;
  var num = 0;

  if (typeof item === 'string' && PS_BATTLE_ITEMS) {
    item = PS_BATTLE_ITEMS[toID(item)];
  }

  if ((_item = item) != null && _item.spritenum) {
    num = _item.spritenum;
  }

  var top = Math.floor(num / 16) * 24;
  var left = (num % 16) * 24;

  var spritesheetURL = 'assets/itemicons-sheet.png';

  return 'background: transparent url(' + spritesheetURL + ') no-repeat scroll -' + left + 'px -' + top + 'px';
}

/*
  Get sprite index numbers for alternate formes from PS_BATTLE_POKEDEX and BattlePokemonIconIndexes
*/
var PS_POKEMON_MINISPRITES = {};

for (const key in PS_BATTLE_POKEDEX) {
  const num = BattlePokemonIconIndexes[key] !== undefined ? BattlePokemonIconIndexes[key] : PS_BATTLE_POKEDEX[key].num;

  PS_POKEMON_MINISPRITES[key] = { num };
}

// Copy getItemIcon
function getMiniSpriteIcon(poke) {
  var _poke;
  var num = 0;

  if (typeof poke === 'string' && PS_POKEMON_MINISPRITES) {
    poke = PS_POKEMON_MINISPRITES[toID(poke)];
  }

  if ((_poke = poke) != null && _poke.num) {
    num = _poke.num;
  }

  var top = Math.floor(num / 12) * 30;
  var left = (num % 12) * 40;

  var spritesheetURL = 'assets/pokemonicons-sheet.png';

  return 'background: transparent url(' + spritesheetURL + ') no-repeat scroll -' + left + 'px -' + top + 'px';
}
