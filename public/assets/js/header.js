document.getElementById("header").innerHTML = `
<a href="/" class="brand">Holy Unblocker</a>
<input id="mnavecb" type="checkbox">
<label for="mnavecb" class="mnave"><span class="mnavebutton"></span></label>
<ul class="navbar">
    <li><a href="/pages/surf.html">Web Proxies</a></li>
    <li><a href="/pages/nav/gtools.html">Games</a></li>
    <li><a href="/faq.html">FAQ</a></li>
    <li><a href="/pages/nav/credits.html">Credits</a></li>
    <li class="dropdown-parent"><a href="#">Settings <i class="fas fa-cog"></i></a>
        <div class="dropdown-child" tabindex="0">
            <div id="csel"></div>
        </div>
    </li>
</ul>
`