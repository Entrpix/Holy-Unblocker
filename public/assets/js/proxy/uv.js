const se = "https://google.com/search?q=%s";
const proxy = localStorage.getItem('proxy');
const url = localStorage.getItem('url');

if (!proxy) {
  localStorage.setItem('proxy', 'uv');
};

function searchUV(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {}
  try {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {}
  return template.replace("%s", encodeURIComponent(input));
}

if (proxy === 'uv') {
  const button = document.getElementById("pr-go");
  const baseUrl = document.getElementById("pr-url");

  button.addEventListener("click", async function(event) {
    event.preventDefault();

    try {
      await registerSW();
    } catch (err) {
      window.location.href = "/pages/error/error.html";
      throw err;
    }    
    const proxyUrl = searchUV(baseUrl.value, se);
    localStorage.setItem('url', __uv$config.prefix + __uv$config.encodeUrl(proxyUrl));
    window.location.href = "/pages/proxy/frame.html"
  });
}