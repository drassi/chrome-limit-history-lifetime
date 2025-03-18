/*
 Author: Nick Semenkovich <semenko@alum.mit.edu>
 License: MIT
 */

"use strict";


var select = document.getElementById("selectHistoryLimit");

// Add days 1-60
for (var i=1; i<=60; i++){
    select.options[select.options.length] = new Option(i);
}

// Load the history limit from storage
chrome.storage.local.get(['historyLimit'], function(result) {
    var historyLimit = result.historyLimit || 4;
    select.selectedIndex = historyLimit - 1;  // Zero indexed.
});


// Called when the select is changed by the user.
function updateLimit() {
    var newValue = select.selectedIndex + 1; // Zero indexed.
    chrome.storage.local.set({historyLimit: newValue}, function() {
        var statusBar = document.getElementById("statusBar");
        statusBar.textContent = 'Saved!';
        setTimeout(function(){ statusBar.textContent = ''; }, 1000);
    });
}

select.addEventListener('change', function() { updateLimit(); }, false);
