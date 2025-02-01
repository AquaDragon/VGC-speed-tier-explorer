// Get HTML elements
var selectFormat = document.getElementById('selectFormat');

var selectFastBST = document.getElementById('selectFastBST');
var selectNeutral252BST = document.getElementById('selectNeutral252BST');
var selectSlowBST = document.getElementById('selectSlowBST');

var selectChoiceScarfBST = document.getElementById('selectChoiceScarfBST');
var selectIronBallBST = document.getElementById('selectIronBallBST');

var selectTailwindBST = document.getElementById('selectTailwindBST');
var selectTailwindMaxBST = document.getElementById('selectTailwindMaxBST');

const formatOptions = [
  { value: 'SV National Dex', text: 'National Dex', var: null },
  {
    value: 'FORMAT_SV_REGULATION_G',
    text: 'Ranked Battle Regulation Set G',
    var: FORMAT_SV_REGULATION_G,
  },
  {
    value: 'SV_REG_G_SHOWDOWN_TOP_50_ELO_1500_JAN_2025',
    text: 'Ranked Battle Regulation Set G (PS! Jan 2025 Top 50, 1500 Elo)',
    var: SV_REG_G_SHOWDOWN_TOP_50_ELO_1500_JAN_2025,
  },
  {
    value: 'FORMAT_SV_REGULATION_H',
    text: 'Ranked Battle Regulation Set H',
    var: FORMAT_SV_REGULATION_H,
  },
  {
    value: 'FORMAT_SV_REGULATION_E',
    text: 'Ranked Battle Regulation Set E',
    var: FORMAT_SV_REGULATION_E,
  },
  {
    value: 'FORMAT_SV_REGULATION_D',
    text: 'Ranked Battle Regulation Set D',
    var: FORMAT_SV_REGULATION_D,
  },
  {
    value: 'FORMAT_SV_REGULATION_C',
    text: 'Ranked Battle Regulation Set C',
    var: FORMAT_SV_REGULATION_C,
  },
  { value: 'FORMAT_SV_SERIES_2', text: 'Ranked Battle Series 2', var: FORMAT_SV_SERIES_2 },
  { value: 'FORMAT_SV_SERIES_1', text: 'Ranked Battle Series 1', var: FORMAT_SV_SERIES_1 },
];

function initializeFormatSelect() {
  formatOptions.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.text = optionData.text;
    selectFormat.appendChild(option);
  });

  // Set default value
  selectFormat.value = 'FORMAT_SV_REGULATION_G';
}

// Initialize dropdown options for selecting MIN & MAX speeds
function initalizeBSTselect() {
  let opFast = [];
  let opNeutral252 = [];
  let opSlow = [];
  let opChoiceScarf = [];
  let opIronBall = [];
  let opTailwind = [];
  let opTailwindMax = [];

  for (let i = 5; i <= 200; i += 5) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    opFast.push(option);
    opNeutral252.push(option.cloneNode(true)); // Clone the option for the slow select
    opSlow.push(option.cloneNode(true));
    opChoiceScarf.push(option.cloneNode(true));
    opIronBall.push(option.cloneNode(true));
    opTailwind.push(option.cloneNode(true));
    opTailwindMax.push(option.cloneNode(true));
  }

  opFast.sort((a, b) => b.value - a.value);
  opNeutral252.sort((a, b) => a.value - b.value);
  opSlow.sort((a, b) => a.value - b.value);
  opChoiceScarf.sort((a, b) => b.value - a.value);
  opIronBall.sort((a, b) => a.value - b.value);
  opTailwind.sort((a, b) => b.value - a.value);
  opTailwindMax.sort((a, b) => b.value - a.value);

  function appendOption(options, select, onUpdate) {
    options.forEach((option) => {
      select.appendChild(option);
      option.addEventListener('change', function () {
        onUpdate(option.value);
      });
    });
  }

  appendOption(opFast, selectFastBST, (value) => (selectFastBST = value));
  appendOption(opNeutral252, selectNeutral252BST, (value) => (selectNeutral252BST = value));
  appendOption(opSlow, selectSlowBST, (value) => (selectSlowBST = value));
  appendOption(opChoiceScarf, selectChoiceScarfBST, (value) => (selectChoiceScarfBST = value));
  appendOption(opIronBall, selectIronBallBST, (value) => (selectIronBallBST = value));
  appendOption(opTailwind, selectTailwindBST, (value) => (selectTailwindBST = value));
  appendOption(opTailwindMax, selectTailwindMaxBST, (value) => (selectTailwindMaxBST = value));

  // Set default values
  selectFastBST.value = '90';
  selectNeutral252BST.value = '70';
  selectSlowBST.value = '70';

  selectChoiceScarfBST.value = '75';
  selectIronBallBST.value = '50';

  selectTailwindBST.value = '65';
  selectTailwindMaxBST.value = '65';
}

initializeFormatSelect();
initalizeBSTselect();
