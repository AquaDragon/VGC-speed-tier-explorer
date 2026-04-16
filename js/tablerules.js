// Get HTML elements
var selectFormat = document.getElementById('selectFormat');

var selectNeutral252BST = document.getElementById('selectNeutral252BST');
var selectChoiceScarfBST = document.getElementById('selectChoiceScarfBST');
var selectIronBallBST = document.getElementById('selectIronBallBST');
var selectTailwindBST = document.getElementById('selectTailwindBST');

const formatOptions = [
  {
    value: 'CHAMPIONS_REG_M_A',
    text: 'Champions Regulation M-A',
    var: CHAMPIONS_REG_M_A,
    isChampions: 1,
    hasIronBall: 0,
  },
  // {
  //   value: 'FORMAT_SV_REGULATION_H',
  //   text: 'SV Ranked Battle Regulation Set H',
  //   var: FORMAT_SV_REGULATION_H,
  // },
  {
    value: 'FORMAT_SV_REGULATION_G',
    text: 'SV Ranked Battle Regulation Set I',  // G and I same mons
    var: FORMAT_SV_REGULATION_G,
  },
  // {
  //   value: 'FORMAT_SV_REGULATION_E',
  //   text: 'SV Ranked Battle Regulation Set E',
  //   var: FORMAT_SV_REGULATION_E,
  // },
  // {
  //   value: 'FORMAT_SV_REGULATION_D',
  //   text: 'SV Ranked Battle Regulation Set D',
  //   var: FORMAT_SV_REGULATION_D,
  // },
  // {
  //   value: 'FORMAT_SV_REGULATION_C',
  //   text: 'SV Ranked Battle Regulation Set C',
  //   var: FORMAT_SV_REGULATION_C,
  // },
  // {
  //   value: 'FORMAT_SV_SERIES_2',
  //   text: 'SV Ranked Battle Series 2',
  //   var: FORMAT_SV_SERIES_2,
  // },
  // {
  //   value: 'FORMAT_SV_SERIES_1',
  //   text: 'SV Ranked Battle Series 1',
  //   var: FORMAT_SV_SERIES_1,
  // },
];

function initializeFormatSelect() {
  formatOptions.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.text = optionData.text;
    option.isChampions = optionData.isChampions;
    option.hasIronBall = optionData.hasIronBall;
    selectFormat.appendChild(option);
  });

  // Set default value
  selectFormat.value = 'CHAMPIONS_REG_M_A';
}

// Initialize dropdown options for selecting MIN & MAX speeds
function initalizeBSTselect() {
  let opNeutral252 = [];
  let opChoiceScarf = [];
  let opIronBall = [];
  let opTailwind = [];

  for (let i = 5; i <= 200; i += 5) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    opNeutral252.push(option.cloneNode(true));
    opChoiceScarf.push(option.cloneNode(true)); // Clone the option for the slow select
    opIronBall.push(option.cloneNode(true));
    opTailwind.push(option.cloneNode(true));
  }

  opNeutral252.sort((a, b) => a.value - b.value);
  opChoiceScarf.sort((a, b) => b.value - a.value);
  opIronBall.sort((a, b) => a.value - b.value);
  opTailwind.sort((a, b) => b.value - a.value);

  function appendOption(options, select, onUpdate) {
    options.forEach((option) => {
      select.appendChild(option);
      option.addEventListener('change', function () {
        onUpdate(option.value);
      });
    });
  }

  appendOption(opNeutral252, selectNeutral252BST, (value) => (selectNeutral252BST = value));
  appendOption(opChoiceScarf, selectChoiceScarfBST, (value) => (selectChoiceScarfBST = value));
  appendOption(opIronBall, selectIronBallBST, (value) => (selectIronBallBST = value));
  appendOption(opTailwind, selectTailwindBST, (value) => (selectTailwindBST = value));

  // Set default values
  selectNeutral252BST.value = '70';

  selectChoiceScarfBST.value = '75';
  selectIronBallBST.value = '50';

  selectTailwindBST.value = '65';
}

initializeFormatSelect();
initalizeBSTselect();
