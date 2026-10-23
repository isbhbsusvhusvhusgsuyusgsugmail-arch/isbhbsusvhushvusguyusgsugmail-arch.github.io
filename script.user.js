// ==UserScript==
// @name         Automated Ad-Link Bypasser
// @namespace    https://github.com
// @version      3.1
// @description  Automatically bypasses ad-shortener gates using an API backend.
// @match        *://*://*
// @match        *://*.linkvertise.net/*
// @match        *://*.lootlabs.gg/*
// @match        *://*.work.ink/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Get the current blocked URL
    const currentUrl = window.location.href;

    // Use a clean placeholder page while resolving to prevent tracking scripts from loading
    document.documentElement.innerHTML = `
        <div style="background:#111; color:#fff; font-family:sans-serif; text-align:center; padding-top:100px; height:100vh;">
            <h1 style="color:#00ff00;">Bypassing Ad Gate...</h1>
            <p>Please wait while the secure API retrieves your target destination.</p>
        </div>
    `;

    // Forward the link to the public, open-source bypass engine API
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://bypass.vip{encodeURIComponent(currentUrl)}`,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                
                // Check if the API successfully extracted the destination link
                if (data && data.destination) {
                    console.log("Success! Redirecting to target...");
                    window.location.replace(data.destination);
                } else if (data && data.target) {
                    window.location.replace(data.target);
                } else {
                    displayError("API could not resolve this link layout. It may be dead or invalid.");
                }
            } catch(e) {
                displayError("Server response format error. Retrying or link is unsupported.");
            }
        },
        onerror: function() {
            displayError("Failed to connect to the bypass network server.");
        }
    });

    function displayError(msg) {
        document.documentElement.innerHTML = `
            <div style="background:#111; color:#ff3333; font-family:sans-serif; text-align:center; padding-top:100px; height:100vh;">
                <h1>Bypass Failed</h1>
                <p>${msg}</p>
                <button onclick="window.location.reload()" style="background:#ff3333; color:#fff; border:none; padding:10px 20px; border-radius:5px; font-weight:bold; margin-top:20px; cursor:pointer;">Retry Original Link</button>
            </div>
        `;
    }
})();
