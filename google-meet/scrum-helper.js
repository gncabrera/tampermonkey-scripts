// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  try to take over the world!
// @author       You
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL  
// ==/UserScript==

(function() {
    'use strict';
    var checked = [];

    // TODO: clear button (save [] > loadCheckboxes
    var getListItemName = function(listitem) {
        var text = listitem.innerText;
        text = text.split("\n")[0];
        return text;
    };
    var saveCheckboxes = function() {
        checked = [];
        var checks = document.querySelectorAll('.mega-checkbox:checked')
        for(var i = 0; i < checks.length; i++) {
            var chk = checks[i];
            var listitem = chk.parentElement;
            var name = getListItemName(listitem);
            checked.push(name);
        }
        localStorage.setItem("scrumCheckboxes", checked);
        console.log("Saved checkboxes: ", checked);

    }
    var loadCheckboxes = function() {
        checked = localStorage.getItem("scrumCheckboxes");
        var checks = document.querySelectorAll('.mega-checkbox');
        for(var i = 0; i < checks.length; i++) {
            var chk = checks[i];
            var listitem = chk.parentElement;
            var name = getListItemName(listitem);
            chk.checked = checked.includes(name);
        }
        console.log("Loaded checkboxes: ", checked);

    }
    var showCheckboxes = function() {

        var checks = document.querySelectorAll('.mega-checkbox');
        if(checks.length > 0)
            return;
        
        console.log("Creating checkboxes...");
        // Se crean los checkboxes
        var items = document.querySelectorAll('[role="listitem"]')
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            let input = document.createElement("input"); //add Input
            input.type = "checkbox"; //specify the type of input to checkbox
            input.classList.add("mega-checkbox");
            input.onchange = saveCheckboxes;
            item.appendChild(input);
        }

        

    }


    setInterval(function() {
        showCheckboxes();
        loadCheckboxes();
    }, 1000);
})();


