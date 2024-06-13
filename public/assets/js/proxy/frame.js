const proxy = localStorage.getItem('proxy');

async function fixUv() {
    try {
        await registerSW();
    } catch (err) {
        // window.location.href = "/pages/error/error.html";
        throw err;
    }
}

if (proxy === 'uv') {
    fixUv();
};

document.getElementById('frame');
const url = localStorage.getItem('url');
frame.src = url;