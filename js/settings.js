// Time variables
var second = 1000;
var minute = second * 60;
var hour = minute * 60;
var day = hour * 24;

// Save expiration
function saveExpirationDuration(expirationDropdownNumber, expirationDropdownTimeUnit) {
  // Convert to milliseconds
  if (expirationDropdownTimeUnit == 'hour(s)') {
    var expirationDuration = expirationDropdownNumber * hour;
  } else if (expirationDropdownTimeUnit == 'day(s)') {
    var expirationDuration = expirationDropdownNumber * day;
  }

  // Save data to Chrome sync storage
  chrome.storage.sync.set({'expirationInMilliseconds': expirationDuration});
  chrome.storage.sync.set({'expirationDropdownNumber': expirationDropdownNumber});
  chrome.storage.sync.set({'expirationDropdownTimeUnit': expirationDropdownTimeUnit});
}

// Listener to save changes to preferences if anything changes
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  var expirationDropdownNumber = document.getElementById('expiration-dropdown-number');
  var expirationDropdownTimeUnit = document.getElementById('expiration-dropdown-time-unit');
  var tabWhitelist = document.getElementById('tab-whitelist-textarea');

  // Get most recent settings
  chrome.storage.sync.get(['expirationDropdownNumber', 'expirationDropdownTimeUnit', 'tabWhitelistTextArea'], function(obj) {
    expirationDropdownNumber.value = obj['expirationDropdownNumber'];
    expirationDropdownTimeUnit.value = obj['expirationDropdownTimeUnit'];
    if (obj['tabWhitelistTextArea']) {
      tabWhitelist.value = obj['tabWhitelistTextArea']
    }
  });

  // Listener for the number
  expirationDropdownNumber.addEventListener('change', function() {
    saveExpirationDuration(expirationDropdownNumber.value, expirationDropdownTimeUnit.value);
  });

  // Listener for the time unit
  expirationDropdownTimeUnit.addEventListener('change', function() {
    saveExpirationDuration(expirationDropdownNumber.value, expirationDropdownTimeUnit.value);
  });

  // Listener for the whitelist
  tabWhitelist.addEventListener('change', function() {
    chrome.storage.sync.set({'tabWhitelistTextArea': tabWhitelist.value});
  });

  // Tab duration info listener
  document.getElementById('show-tab-duration-modal').addEventListener('click', function() {
    document.getElementById('tab-duration-modal').classList.add('is-active');
  });

  // Tab duration modal close listener
  document.getElementById('tab-duration-modal-close').addEventListener('click', function() {
    document.getElementById('tab-duration-modal').classList.remove('is-active');
  });

  // Tab whitelist info listener
  document.getElementById('show-tab-whitelist-modal').addEventListener('click', function() {
    document.getElementById('tab-whitelist-modal').classList.add('is-active');
  });

  // Tab whitelist modal close listener
  document.getElementById('tab-whitelist-modal-close').addEventListener('click', function() {
    document.getElementById('tab-whitelist-modal').classList.remove('is-active');
  });
});
