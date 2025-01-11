// ==UserScript==
// @name         Metacritic - RED Search
// @namespace    http://tampermonkey.net/
// @version      2025-01-11
// @description  try to take over the world!
// @author       You
// @match        https://www.metacritic.com/browse/albums/release-date/coming-soon/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=metacritic.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $("tr .albumTitle").each(function() {
       var $title = $(this);
       var title = $title.text().trim();
        $title.append(`
        &nbsp;
        (<a href="https://redacted.sh/torrents.php?searchstr=${title}" target="_blank">RED</a>)
       `);

       var $artist = $title.parent().find(".artistName");

        var artist = $artist.text().trim()
       $artist.append(`
       &nbsp;
       (<a href="https://redacted.sh/torrents.php?searchstr=${artist}" target="_blank">RED</a>)
       `);
    });
    // Your code here...
})();
