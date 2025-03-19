/*
 Author: Nick Semenkovich <semenko@alum.mit.edu>
 License: MIT
 */

"use strict";


var select = document.getElementById("selectHistoryLimit");
var lastRunSpan = document.getElementById("lastRun");

// Add days 1-60
for (var i=1; i<=60; i++){
    select.options[select.options.length] = new Option(i);
}

// Load the history limit from storage
chrome.storage.local.get(['historyLimit', 'lastRun'], function(result) {
    var historyLimit = result.historyLimit || 4;
    select.selectedIndex = historyLimit - 1;  // Zero indexed.

    var lastRun = result.lastRun;
    if (lastRun) {
        lastRunSpan.textContent = timeAgo(lastRun);
    } else {
        lastRunSpan.textContent = "Never";
    }
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

/**
 * Converts a timestamp to a user-friendly "time ago" string
 * @param {number} timestamp - The timestamp in milliseconds
 * @return {string} A friendly string like "2 minutes ago" or "3 days ago"
 */
function timeAgo(timestamp) {
    const now = Date.now();
    const diffMs = now - timestamp;

    // Convert to seconds
    const diffSec = Math.floor(diffMs / 1000);

    // Less than a minute
    if (diffSec < 60) {
        return 'Just now';
    }

    // Minutes (less than an hour)
    if (diffSec < 3600) {
        const minutes = Math.floor(diffSec / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Hours (less than a day)
    if (diffSec < 86400) {
        const hours = Math.floor(diffSec / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Days
    const days = Math.floor(diffSec / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}
