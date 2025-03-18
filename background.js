/*
 Limit the lifetime of history entries in Chrome.

 WARNING: This isn't thoroughly tested, and could cause unexpected history changes / performance issues.

 Author: Nick Semenkovich <semenko@alum.mit.edu>
 License: MIT
 */

"use strict";

function scanHistory() {
    // Grab the history preference, or default to 4 days.
    chrome.storage.local.get(['historyLimit'], function(result) {
        var maxHistoryLifeInDays = result.historyLimit || 4;
        
        var maxHistoryLifeInMilliseconds = maxHistoryLifeInDays * 24 * 60 * 60 * 1000;
        
        var maxTime = Date.now() - maxHistoryLifeInMilliseconds;
        
        // Wow, this is an easy API.
        chrome.history.deleteRange({startTime: 0, endTime: maxTime},
            function() { if (chrome.runtime.lastError) { console.warn(chrome.runtime.lastError); } }
        );
    });
}


// Called on first run/update
function setup() {
    // Run every two hours
    chrome.alarms.create("scanHistory", { periodInMinutes: 120 });

    // And let's run once right now!
    scanHistory();
}

// Set some onInstalled listeners to fire, since we're not a persistent background page.
chrome.runtime.onInstalled.addListener(setup);

chrome.alarms.onAlarm.addListener(function(alarm) { scanHistory(); });

// Let's run once at startup, too, since alarm can be finicky.
chrome.runtime.onStartup.addListener(function() { scanHistory(); });
