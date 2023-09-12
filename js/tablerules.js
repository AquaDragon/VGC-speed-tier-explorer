// Get HTML elements
var selectFormat = document.getElementById('selectFormat');

var selectFastBST = document.getElementById('selectFastBST');
var selectSlowBST = document.getElementById('selectSlowBST');

const formatOptions = [
  { value: 'SV National Dex', text: 'National Dex', var: null },
  {
    value: 'FORMAT_SV_REGULATION_E',
    text: 'Ranked Battle Regulation Set E (unconfirmed)',
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
  selectFormat.value = 'FORMAT_SV_REGULATION_E';
}

// Initialize dropdown options for selecting MIN & MAX speeds
function initalizeBSTselect() {
  let fastOptions = [];
  let slowOptions = [];

  for (let i = 5; i <= 200; i += 5) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    fastOptions.push(option);
    slowOptions.push(option.cloneNode(true)); // Clone the option for the slow select
  }

  fastOptions.sort((a, b) => b.value - a.value);
  slowOptions.sort((a, b) => a.value - b.value);

  fastOptions.forEach((option) => {
    selectFastBST.appendChild(option);
  });

  slowOptions.forEach((option) => {
    selectSlowBST.appendChild(option);
  });

  // Set default values
  selectFastBST.value = '90';
  selectSlowBST.value = '70';
}

initializeFormatSelect();
initalizeBSTselect();
