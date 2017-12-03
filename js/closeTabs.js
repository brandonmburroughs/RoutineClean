// For every window, iterate through all of the tabs and perform an action
function actionOnAllTabs(callback) {
  chrome.windows.getAll({populate: true}, function(windows){
    // Iterate through all windows
    windows.forEach(function(window){
      //Iterate through all tabs
      window.tabs.forEach(function(tab){
        // Perform function on tab
        callback(tab);
      });
    });
  });  
}

// Close the given tab
function closeTab(tab) {
  // Close the tab
  chrome.tabs.remove(tab.id);
};

// Get the history for a tab's url and close old tabs
function closeExpiredTabs(tab, duration) {
  var freshTabs = 0;
  // Query history given a tab's url
  chrome.history.getVisits({url: tab.url}, function(results) {
    // Iterate through the results
    results.forEach(function(result){
      // Check if the tab has been open for less than the given duration
      var pageDuration = (new Date).getTime() - result.visitTime
      if (pageDuration < duration) {
        freshTabs += 1
      }
    });

    if (freshTabs == 0) {
      closeTab(tab);
    }
  });
}

// Close all expired tabs
function closeAllExpiredTabs() {
  chrome.storage.sync.get('expirationInMilliseconds', function(obj) {
    actionOnAllTabs(function(tab){
      closeExpiredTabs(tab, obj['expirationInMilliseconds']);
    });
  });
}

// Create an hourly alarm
chrome.alarms.create("1hour", {
  delayInMinutes: 60,
  periodInMinutes: 60
});

// Add listener to alarm that closes expired tabs
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "1hour") {
    closeAllExpiredTabs();
  }
});