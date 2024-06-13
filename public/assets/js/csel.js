function pageIcon(value) {
    let tag = document.querySelector("link[rel*='icon']") || document.createElement("link");
    tag.rel = "icon";
    tag.href = value;
    document.head.appendChild(tag);
}

function pageTitle(value) {
    document.title = value;
}

function setTitle(value) {
    pageTitle(value);
    localStorage.setItem("HBTitle", value);
}

function setIcon(value) {
    pageIcon(value);
    localStorage.setItem("HBIcon", value);
}

let storedTitle = localStorage.getItem("HBTitle");
if (storedTitle && storedTitle != "undefined") pageTitle(storedTitle);

let storedIcon = localStorage.getItem("HBIcon");
if (storedIcon && storedIcon != "undefined") pageIcon(storedIcon);

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
<input id="cselab" class"cselbutton" type="button" value="about:blank">

    `;

    document.getElementById("titleform").addEventListener("submit", function (e) {
        e.preventDefault();
        if (this.firstElementChild.value) {
            setTitle(this.firstElementChild.value);
            this.firstElementChild.value = "";
        } else {
            alert("Please provide a title.");
        }
    }, false);

    document.getElementById("iconform").addEventListener("submit", function (e) {
        e.preventDefault();
        if (this.firstElementChild.value) {
            setIcon(this.firstElementChild.value);
            this.firstElementChild.value = "";
        } else {
            alert("Please provide an icon URL.");
        }
    }, false);

    document.getElementById("cselreset").addEventListener("click", function () {
        const r = confirm("Are you sure you want to reset the title and icon?");
        if (!r) return;

        localStorage.removeItem("HBTitle");
        localStorage.removeItem("HBIcon");

        pageTitle("Holy Unblocker");
        pageIcon(window.location.origin + "/assets/img/icon.png");
    });

    document.getElementById("cselab").addEventListener("click", function () {
        var win = window.open()
        var url = `${window.location.href}`
        var iframe = win.document.createElement('iframe')
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.style.margin = "0";
        iframe.style.padding = "0";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.bottom = "0";
        iframe.style.left = "0";
        iframe.style.right = "0";
        iframe.src = url;
        win.document.body.appendChild(iframe)
    });
}