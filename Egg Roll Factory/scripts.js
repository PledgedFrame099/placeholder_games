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

function getElement(name) {
    return document.getElementById(name);
}

function refreshUi() {
    getElement('counter').innerHTML = Math.floor(clicks);
    getElement('level').innerHTML = level;
    getElement('to_next_level').innerHTML = Math.floor(xpNeed);
    getElement('cps').innerHTML = cps;
    getElement('cpc').innerHTML = cpc;
    getElement('exp').style.width = (xp / xpNeed) * 50 + "%";
    getElement('exp_counter').innerHTML = Math.floor(xp);
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
    let available = getElement("buy_all").checked ? Math.floor(clicks / resourceCost) : 1;

    if (clicks < resourceCost * available) return;

    clicks -= resourceCost * available;

    if (type === 'cpc') cpc += available * increment;
    else if (type === 'cps') cps += available * increment;

    refreshUi();
}

//explosion animation
function boom() {
    boomprog = 0;
    getElement('image').src = "explosion.gif";
    setTimeout(() => {
        getElement('image').src = "eggroll.png";
    }, 800);
}

setInterval(() => {
    clicks += cps * 0.01;
    xp += cps * 0.01;

    checkLevelUp();

    Save();
    refreshUi();
}, 10);

Load();