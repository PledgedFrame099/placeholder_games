let clicks, cps, xp, cpc, level, xpNeed, boomprog;

function setDefaultValues() {
    [clicks, cps, xp, boomprog] = [0, 0, 0, 0];
    [cpc, level] = [1, 1];
    xpNeed = 100;
}

setDefaultValues();

function Load() {
    const dataRaw = localStorage.getItem("data");

    if (!dataRaw) {
        setDefaultValues();
        refreshUi();
        return;
    }

    ({ clicks, cps, cpc, xp, xpNeed, level } = JSON.parse(dataRaw));

    refreshUi();
}

function Save() {
    localStorage.setItem("data", JSON.stringify({ clicks, cps, cpc, xp, xpNeed, level }));
}

function getElem(name) {
    return document.getElementById(name);
}

function refreshUi() {
    getElem('counter').innerHTML = Math.floor(clicks);
    getElem('level').innerHTML = level;
    getElem('to_next_level').innerHTML = Math.floor(xpNeed);
    getElem('cps').innerHTML = cps;
    getElem('cpc').innerHTML = cpc;
    getElem('exp').style.width = (xp / xpNeed) * 50 + "%";
    getElem('exp_counter').innerHTML = Math.floor(xp);
}

function reset() {
    if (!confirm("Are you sure you want to reset all of your progress?")) return;
    if (!confirm('Are you really really sure? (You will not recieve anything.)')) return;

    localStorage.removeItem("data");
    Load();
}

function levelUp(){
    level++;

    xp -= xpNeed;

    xpNeed = level === 2 ? 1000 : xpNeed * 1000;

    refreshUi();
}

function checkLevelUp() {
    while (xp >= xpNeed) {
        levelUp();
    }
}

function clicked() {
    clicks += cpc;
    xp += cpc;

    checkLevelUp();

    boomprog++;
    if (boomprog === 100) boom();
}

function upgrade(resourceCost, increment, type) {
    //available is 1 unless "buy all" is checked
    let available = getElem("buy_all").checked ? Math.floor(clicks / resourceCost) : 1;

    const totalCost = resourceCost * available;

    if (clicks < totalCost) return;

    clicks -= totalCost;

    const amountToAdd = available * increment;

    if (type === 'cpc') cpc += amountToAdd;
    else if (type === 'cps') cps += amountToAdd;

    refreshUi();
}

//explosion animation
function boom() {
    boomprog = 0;
    getElem('image').src = "explosion.gif";
    setTimeout(() => {
        getElem('image').src = "eggroll.png";
    }, 800);
}

setInterval(() => {
    const gain = cps / 100;
    clicks += gain;
    xp += gain;

    checkLevelUp();

    Save();
    refreshUi();
}, 10);

Load();