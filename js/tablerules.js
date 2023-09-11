// Get HTML elements
var selectFormat = document.getElementById('selectFormat');

var selectFastBST = document.getElementById('selectFastBST');
var selectSlowBST = document.getElementById('selectSlowBST');

function initializeFormatSelect() {
  const formatOptions = [
    { value: 'SV Ranked Battle Regulation E', text: 'SV Ranked Battle Regulation E' },
    { value: 'SV Ranked Battle Regulation D', text: 'SV Ranked Battle Regulation D' },
    { value: 'SV National Dex', text: 'SV National Dex' },
  ];

  formatOptions.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.text = optionData.text;
    selectFormat.appendChild(option);
  });

  // Set default value
  selectFormat.value = 'SV Ranked Battle Regulation E';
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
