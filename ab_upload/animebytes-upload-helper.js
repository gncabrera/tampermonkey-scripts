// ==UserScript==
// @name         Animebytes Upload Helper
// @namespace    http://tampermonkey.net/
// @version      2024-08-23
// @description  try to take over the world!
// @author       You
// @match        https://animebytes.tv/upload.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animebytes.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ========= JSON AUTOFILL
    var $autofill = $(`
<dt>Autoupload Json Data</dt>
<dd>
<input id="autofill_json" name="autofill_json" type="file" size="50" accept=".json">
<br><br>
</dd>
    `);

    //$("#autofill .box.pad").prepend($autofill);
    $("#upload_form_music").before($autofill);

    // ========= IMAGE UPLOADER

    $("#image_music").after(`<br /><a href="#" target="_blank" id="uploadImgLink">Upload Image</a>`);


     setTimeout(function () {
         $("#ui-id-5").click();
         var accept = isAddFormat() ? ".v0.torrent" : ".flac.torrent";
         $("#file_input_music").attr("accept", accept);
     }, 200);

    $("body").on("change", "#autofill_json", function(e) {
        setTimeout(function () {
            var file = $("#autofill_json")[0].files[0];
            if (file) {
                var reader = new FileReader();

                reader.onload = function (evt) {
                    console.log("mmm2");
                    var jsonFile = evt.target.result;
                    var data = JSON.parse(jsonFile);
                    setValues(data);
                    //$("#file_input_music").click();
                }
                reader.onerror = function (evt) {
                    console.error("error reading file", evt);
                }
                reader.readAsText(file, "UTF-8");
            }
        }, 1000);

    });
    let data = {
    artistName: "1",
    titleEnglish: "2",
    titleJapanese: "3",
    type: "Album", //Album, Soundtrack, Single, EP, Compilation, Remix CD, Live Album, Spokenword, Image CD, Vocal CD
    year: "4",
    tags: "5",
    image: "6",
    description:
    [
"01. RED OUT",
"02. KICK BACK",
"03. マルゲリータ ＋ アイナ・ジ・エンド",
"04. POP SONG",
"05. 死神",
"06. 毎日 - Every Day",
"07. LADY",
"08. ゆめうつつ - Daydream",
"09. さよーならまたいつか!- Sayonara",
"10. とまれみよ - Stop Look Both Ways",
"11. LENS FLARE"
],
    encoding: "FLAC", // AAC, MP3, FLAC
    bitrate: "Lossless", // 192, V2 (VBR), 256, V0 (VBR), 320, Lossless, Lossless 24-bit
    media: "Web", //CD, DVD, Blu-ray, Cassette, Vinyl, Soundboard, Web
    catalogNumber: "ABCDE-12345",
    editionTitle: "7",
    editionDate: "YYYY-MM-DD", // YYYY-MM-DD or YYYY-MM
};

})();

function isAddFormat() {
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get("groupid");
}

function setValues(data) {

    // Modifying for MP3 V0 Uploads
    if(isAddFormat()) {
        data.encoding = "MP3";
        data.bitrate = "V0 (VBR)";
    }

    $("#artist_music_0").val(data.artistName);
    $("#title").val(data.titleEnglish);
    $("#title2").val(data.titleJapanese);
    $("#cdtype").val(data.type);
    $("#year_music").val(data.year);
    $("#tags_music").val(data.tags);
    $("#image_music").val(data.image);
    $("#uploadImgLink").attr("href", `https://animebytes.tv/imageupload.php?img-upload=${data.image}`);
    $("#desc_music").text(data.description.join("\n"));
    $("#encoding").val(data.encoding);
    $("#bitrate").val(data.bitrate);
    $("#cdmedia").val(data.media);
    $("[name=catalog_number]").val(data.catalogNumber);
    $("#edition_title").val(data.editionTitle);
    if(data.editionDate.length === 4) data.editionDate = data.editionDate + "-01-01";
    $("#edition_date").val(data.editionDate);
}
