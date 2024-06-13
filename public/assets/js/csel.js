/* -----------------------------------------------
/* Authors: OlyB
/* MIT license: http://opensource.org/licenses/MIT
/* Settings Menu
/* ----------------------------------------------- */

(function() {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 100);
    date = date.toUTCString();

    let csel = document.getElementById("csel");

    function setCookie(name, value) {
        document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date + "; ";
    }

    function removeCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; ";
    }

    async function readCookie(name) {
        let cookie = document.cookie.split("; ");
        let cookies = {};
        for (let i = 0; i < cookie.length; i++) {
            let p = cookie[i].split("=");
            cookies[p[0]] = p[1];
        }
        return decodeURIComponent(cookies[name]);
    }

    function pageTitle(value) {
        let tag = document.getElementsByTagName("title")[0] || document.createElement("title");
        tag.innerHTML = value;
        document.head.appendChild(tag);
    }

    function pageIcon(value) {
        let tag = document.querySelector("link[rel*='icon']") || document.createElement("link");
        tag.rel = "icon";
        tag.href = value;
        document.head.appendChild(tag);
    }

    function setTitle(value) {
        pageTitle(value);
        setCookie("HBTitle", value);
    }

    function setIcon(value) {
        pageIcon(value);
        setCookie("HBIcon", value);
    }

    readCookie("HBTitle").then(s => (s != "undefined") && pageTitle(s));
    readCookie("HBIcon").then(s => (s != "undefined") && pageIcon(s));

    if (csel) {
        csel.innerHTML = `
<p class="cseltitle">Tab Cloak</p>
<p class="csellabel">Change the title:</p>
<form class="cselform" id="titleform">
    <input type="text" placeholder="Tab Title" spellcheck="false"><input class="cselbutton" type="submit" value="Apply">
</form>
<p class="csellabel">Change the icon:</p>
<form class="cselform" id="iconform">
    <input type="text" placeholder="Icon URL" spellcheck="false"><input class="cselbutton" type="submit" value="Apply">
</form>
<input id="cselreset" class="cselbutton" type="button" value="Reset">
        `;

        document.getElementById("titleform").addEventListener("submit", function(e) {
            e.preventDefault();
            if (this.firstElementChild.value) {
                setTitle(this.firstElementChild.value);
                this.firstElementChild.value = "";
            } else {
                alert("Please provide a title.");
            }
        }, false);

        document.getElementById("iconform").addEventListener("submit", function(e) {
            e.preventDefault();
            if (this.firstElementChild.value) {
                setIcon(this.firstElementChild.value);
                this.firstElementChild.value = "";
            } else {
                alert("Please provide an icon URL.");
            }
        }, false);

        document.getElementById("cselreset").addEventListener("click", function() {
            if (confirm("Reset the title and icon to default?")) {
                removeCookie("HBTitle");
                removeCookie("HBIcon");
                pageTitle("H&shy;o&shy;ly Un&shy;blo&shy;ck&shy;er");
                pageIcon("assets/img/icon.png");
            }
        }, false);
    }
})();