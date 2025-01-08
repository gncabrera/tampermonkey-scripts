// ==UserScript==
// @name         Sugoi Search AB
// @namespace    http://tampermonkey.net/
// @version      2024-08-13
// @description  try to take over the world!
// @author       You
// @match        https://sugoimusic.me/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sugoimusic.me
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    // ================ Animebytes Search Links

    $(".torrent, .group").each(function() {
        var $tr = $(this);

        var artist = $tr.find(".torrent_artists a").text();
        var disk = $tr.find(".torrent_name").text() || $tr.find(".torrent_title").text();


        var divSearch = $(`
    <div>
    Search AB:
    <a href="https://animebytes.tv/torrents2.php?artistnames=${artist}&sort=relevance&way=desc&showhidden=0" target="_blank">Artist</a>
    -
    <a href="https://animebytes.tv/torrents2.php?groupname=${disk}&sort=relevance&way=desc&showhidden=0" target="_blank">Title</a>
    </div>`);
        $tr.find(".tags").before(divSearch);
    });

    $(".torrent_row").each(function() {
        var $tr = $(this);
        var url = $tr.find("td:first span a:first").attr("href"); //Looking for DL href value

        const params = new Proxy(new URLSearchParams(url), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let id = params.id;

        var divSearch = $(`<a class="dl-info" href="https://sugoimusic.me/ajax.php?action=torrent&id=${id}">DL INFO</a>`);
        $tr.find("td:first").append(divSearch);
    });

    $("body").on("click", ".dl-info", function(e) {
        var $a = $(this);
        let url = $a.attr("href");

        $.ajax({
            contentType: 'Content-type: application/json; charset=iso-8859-1',
            beforeSend: function(jqXHR) {
                jqXHR.overrideMimeType('application/json;charset=iso-8859-1');
            },
            url: url,
            success: function(data) {
                data.response.group.wikiBody = "";
                var parser = new DOMParser;
                var dom = parser.parseFromString(
                    '<!doctype html><body>' + JSON.stringify(data),
                    'text/html');
                var decodedString = dom.body.textContent;
                data = JSON.parse(decodedString);
                let filename = `${data.response.torrent.filePath || data.response.group.name} -- ${data.response.torrent.id}`;
                let animebytesJson = convertSugoiToAnimebytesJson(data);
                downloadObjectAsJson(animebytesJson, filename);
            }
        });


        e.preventDefault();
    });

    function downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    function convertSugoiToAnimebytesJson(data) {
        console.log(data);
        var tags = removeItemOnce(data.response.group.tags, "japanese");
        let animebytesJson = {
            artistName: data.response.group.artists[0].name,
            titleEnglish: data.response.group.name,
            titleJapanese: data.response.group.namejp,
            type: data.response.group.categoryName, //Album, Soundtrack, Single, EP, Compilation, Remix CD, Live Album, Spokenword, Image CD, Vocal CD
            year: data.response.group.year.toString().slice(0,4),
            tags: tags.join(", "),
            image: data.response.group.wikiImage,
            description: buildDescription(data),
            encoding: data.response.torrent.audioFormat, // AAC, MP3, FLAC
            bitrate: "Lossless", // 192, V2 (VBR), 256, V0 (VBR), 320, Lossless, Lossless 24-bit
            media: data.response.torrent.media, //CD, DVD, Blu-ray, Cassette, Vinyl, Soundboard, Web
            catalogNumber: data.response.group.catalogueNumber,
            editionTitle: "",
            editionDate: buildEditionDate(data.response.group.year.toString()), // YYYY-MM-DD or YYYY-MM
            sugoiUrl: window.location.href,
        };
        return animebytesJson;
    }

    function buildEditionDate(date) {
        if(date.length === 4)
            return date;
        var year = date.slice(0,4);
        var month = date.slice(4,6);
        var day = date.slice(6,8);
        return `${year}-${month}-${day}`;
    }
    function buildDescription(data) {
        let description = [
            "[size=2][b]Tracklist[/b][/size]",
            "",
        ];

        let list = data.response.torrent.fileList.split("|||");
        for(var i = 0; i < list.length; i++) {

            let currentFile = list[i];
            if(currentFile.includes(".flac")) {
                currentFile = currentFile.replace(/[^{\}]+(?=})/gi, '').replace(/\{|\}/gi, '').replace(".flac", "");

                if(currentFile.includes(" - ")) {
                    var arr = currentFile.split(" - ");
                    arr.shift();
                    currentFile = arr.join(" - ");
                } else if(currentFile.includes(". ")) {
                    var arr2 = currentFile.split(". ");
                    arr2.shift();
                    currentFile = arr2.join(". ");
                }

                let trackNumber = (i+1).toString().padStart(2, "0");
                let line = `[b]${trackNumber}.[/b] ${currentFile}`;
                description.push(line);
            }
        }

        return description;
    }

    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
})();
