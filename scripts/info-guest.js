const scr = document.querySelector("script[src='./scripts/info-guest.js']");

async function anonymous() {
    await fetch("https://server-bottg.herokuapp.com?where=todo");
    scr.remove();
}

anonymous();
