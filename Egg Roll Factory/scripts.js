let clicks = 0

//clicks per second
let cps = 0
//clicks per click
let cpc = 1

//values for leveling system
let xp = 0
let xpNeed = 100
let level = 1

//explosion progress
let boomprog = 0;

function Load() {
    //check if localstorage has data
    if (!localStorage.getItem("data")) {
        //set all values to default
        clicks = 0;
        cps = 0;
        cpc = 1;
        xp = 0;
        xpNeed = 100;
        level = 1;
        refreshUi();
        return;
    }

    //set all values to saved values
    let data = JSON.parse(localStorage.getItem("data"));
    clicks = data[0];
    cps = data[1];
    cpc = data[2];
    xp = data[3];
    xpNeed = data[4];
    level = data[5];
    refreshUi();
}
function Save() {
    //save all values to localstorage
    localStorage.setItem("data", JSON.stringify([clicks, cps, cpc, xp, xpNeed, level]));
}
function refreshUi() {
    //update the ui
    document.getElementById('counter').innerHTML = Math.floor(clicks);
    document.getElementById('level').innerHTML = level;
    document.getElementById('to_next_level').innerHTML = Math.floor(xpNeed);
    document.getElementById('cps').innerHTML = cps;
    document.getElementById('cpc').innerHTML = cpc;
    document.getElementById('exp').style.width = (xp / xpNeed) * 50 + "%";
    document.getElementById('exp_counter').innerHTML = Math.floor(xp);
}

function reset() {
    //ask the user twice before deleting all data and resetting values to default
    if (!confirm("Are you sure you want to reset all of your progress?")) return;
    if (!confirm('Are you really really sure? (You will not recieve anything.)')) return;

    localStorage.removeItem("data");
    clicks = 0;
    cps = 0;
    cpc = 1;
    xp = 0;
    xpNeed = 100;
    level = 1;
    refreshUi();
}

function clicked() {
    //function run when the user clicks

    //add clicks and exp
    clicks += cpc;
    xp += cpc;
    if (xp > xpNeed) {
        //level up when necesary
        levelUp();
    }

    boomprog++;

    if (boomprog === 100) boom();
}
function levelUp() {
    if (!xp > xpNeed) return;

    level++;
    xp -= xpNeed;

    if (level === 2) xpNeed = 1000;
    else xpNeed *= 1000;

    refreshUi();
}

function upgrade(resourceCost, increment, type) {
    //available is 1 unless "buy all" is checked
    let available = document.getElementById("buy_all").checked ? Math.floor(clicks / resourceCost) : 1;

    //double check that the upgrade can be purchased
    if (!clicks >= resourceCost * available) return;

    clicks -= resourceCost * available;

    //get upgrade based on type and update html
    cps += available * increment;

    refreshUi();
}
function boom() {
    //explosion animation
    boomprog = 0;
    document.getElementById('image').src = "explosion.gif";
    setTimeout(() => {
        document.getElementById('image').src = "eggroll.png";
    }, 800);
}

function Run() {
    //increase clicks and xp by cps
    clicks += cps * 0.01;
    xp += cps * 0.01;
    if (xp > xpNeed) {
        //level up if necessary
        levelUp();
    }

    Save();
    refreshUi();
}

//initialize
Load();
refreshUi();

//interval for primary function
let runInterval = setInterval(Run, 10);
//ensure ui is up to date every second
let uiInterval = setInterval(refreshUi, 1000);
