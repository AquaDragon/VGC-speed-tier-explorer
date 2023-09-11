// Get HTML elements
var selectFormat = document.getElementById('selectFormat');

var dropdownFastBST = document.getElementById('dropdownFastBST');
var dropdownSlowBST = document.getElementById('dropdownSlowBST');

// Initialize dropdown box options for selecting MIN & MAX speeds
function initalizeBSTDropdown() {
  let fastOptions = [];
  let slowOptions = [];

  for (let i = 5; i <= 200; i += 5) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    fastOptions.push(option);
    slowOptions.push(option.cloneNode(true)); // Clone the option for the slow dropdown
  }

  fastOptions.sort((a, b) => b.value - a.value);
  slowOptions.sort((a, b) => a.value - b.value);

  fastOptions.forEach((option) => {
    dropdownFastBST.appendChild(option);
  });

  slowOptions.forEach((option) => {
    dropdownSlowBST.appendChild(option);
  });

  // Set default values
  dropdownFastBST.value = '90';
  dropdownSlowBST.value = '70';
}

initalizeBSTDropdown();
