// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-74212008-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function trackButtonClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
};

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

  // Listeners for the number
  expirationDropdownNumber.addEventListener('click', trackButtonClick);
  expirationDropdownNumber.addEventListener('change', function() {
    saveExpirationDuration(expirationDropdownNumber.value, expirationDropdownTimeUnit.value);
  });

  // Listeners for the time unit
  expirationDropdownTimeUnit.addEventListener('click', trackButtonClick);
  expirationDropdownTimeUnit.addEventListener('change', function() {
    saveExpirationDuration(expirationDropdownNumber.value, expirationDropdownTimeUnit.value);
  });

  // Listeners for the whitelist
  tabWhitelist.addEventListener('click', trackButtonClick);
  tabWhitelist.addEventListener('change', function() {
    chrome.storage.sync.set({'tabWhitelistTextArea': tabWhitelist.value});
  });

  // Tab duration info listeners
  document.getElementById('show-tab-duration-modal').addEventListener('click', function(e) {
    document.getElementById('tab-duration-modal').classList.add('is-active');
    trackButtonClick(e);
  });

  // Tab duration modal close listeners
  document.getElementById('tab-duration-modal-close').addEventListener('click', function(e) {
    document.getElementById('tab-duration-modal').classList.remove('is-active');
    trackButtonClick(e);
  });

  // Tab whitelist info listener
  document.getElementById('show-tab-whitelist-modal').addEventListener('click', function(e) {
    document.getElementById('tab-whitelist-modal').classList.add('is-active');
    trackButtonClick(e);
  });

  // Tab whitelist modal close listener
  document.getElementById('tab-whitelist-modal-close').addEventListener('click', function(e) {
    document.getElementById('tab-whitelist-modal').classList.remove('is-active');
    trackButtonClick(e);
  });
});
