/**
 * Created by Proggeo on 3/16/2016.
 */

var chunkSize = 0; //current amount of cards
var activePokemon = null;
var responseCards = null;
var typeCount = 20; //default value, refreshes with getTypes()
var colors = ["C1BDDB", "FF99C9", "02C39A", "FFCDB2", "E8871E", "FFB4A2", "EDB458", "BAD4AA", "4FB477", "E5989B", "F0F3BD", "EDB458", "52FFEE", "B5838D", "B191FF", "DCFFFD", "EBF5DF", "DF99F0", "D4D4AA", "D664BE"];
var typeColors = [];
var filtered = null; //saves current filtered type

$(document).ready(function () {
    getTypes();
    window.onresize();
});

window.onresize = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    if (height < 550) {
        document.getElementById("rightContainer").style.position = "static";
        document.getElementById("rightContainer").style.float = "left";
        document.getElementById("rightContainer").style.top = "100px";
    }
    else if (height < 650) {
        document.getElementById("rightContainer").style.position = "fixed";
        document.getElementById("rightContainer").style.top = "100px";
    }
    else {
        document.getElementById("rightContainer").style.position = "fixed";
        document.getElementById("rightContainer").style.top = "" + (height - 450) / 2 + "px";
    }

    if (width < 650) {
        if (document.getElementById("cardsContainer") != null)document.getElementById("cardsContainer").style.width = "100%";
        document.getElementById("rightContainer").style.position = "static";
        document.getElementById("rightContainer").style.clear = "both";
        document.getElementById("rightContainer").style.width = "100%";
        document.getElementById("largeCard").style.margin = "auto";
        document.getElementById("rightContainer").parentNode.insertBefore(document.getElementById("rightContainer"),document.getElementById("container"));
    }
    else {
        if (document.getElementById("cardsContainer") != null)document.getElementById("cardsContainer").style.width = "" + width - 370 + "px";
        document.getElementById("rightContainer").style.clear = "none";
        document.getElementById("rightContainer").style.float = "left";
        document.getElementById("rightContainer").style.width = null ;
        document.getElementById("rightContainer").parentNode.insertBefore(document.getElementById("container"),document.getElementById("rightContainer"));

    }
};


function load () {
    var xmlhttp = new XMLHttpRequest();
    chunkSize += 12;
    var url = "http://pokeapi.co/api/v1/pokemon/?limit=" + chunkSize;

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            responseCards = JSON.parse(xmlhttp.responseText);
            loadCards(responseCards);
            window.onresize();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};

function loadCards(arr) {
    var out = "";
    var i;
    out += "<div id='cardsContainer'>";
    for (i = 0; i < arr.objects.length; i++) {
        var currPokemon = arr.objects[i];
        out += "<div id='smallCard' class = 'card' onclick=\"activate(this)\">";
        out += "<div id='smallView' style=\"background: url('http://pokeapi.co/media/img/" + currPokemon.national_id + ".png') no-repeat; background-size:contain;\"></div>";
        out += '<p class="name">' + currPokemon.name + '</p>';
        for (var j = 0; j < currPokemon.types.length; j++) {
            for (var k = 0; k < typeCount; k++) {
                if (currPokemon.types[j].name.toLowerCase() === typeColors[k].name.toLowerCase()) var currType = typeColors[k];
            }
            var currStyle = 'style="border: ' + currType.color + ' solid 1px; background: ' + currType.lightColor + '; background: -webkit-linear-gradient(' + currType.lightColor + ', ' + currType.color + '); background: -o-linear-gradient(' + currType.lightColor + ', ' + currType.color + ');background: -moz-linear-gradient(' + currType.lightColor + ', ' + currType.color + ');background: linear-gradient(' + currType.lightColor + ', ' + currType.color + '); "';

            out += '<p class="powerType" ' + currStyle + ' onclick="filter(\'' + currPokemon.types[j].name + '\')">' + currPokemon.types[j].name.charAt(0).toUpperCase() + currPokemon.types[j].name.slice(1) + '</p>';
        }
        out += '</div>';
    }
    out += "</div>";
    document.getElementById("container").innerHTML = out;
}

function activate (element) {
    if (activePokemon == null) {
        activePokemon = element;
        activePokemon.id = "activeCard";
        document.getElementById("largeCard").style.display = "block";
        buildLargeCard(element);

    }
    else if (activePokemon == element) {
        activePokemon.id = "smallCard";
        activePokemon = null;
        document.getElementById("largeCard").style.display = "none";
    }
    else {
        activePokemon.id = "smallCard";
        activePokemon = element;
        activePokemon.id = "activeCard";
        buildLargeCard(element);
    }
};

function getTypes () {
    var xmlhttp = new XMLHttpRequest();
    var url = "http://pokeapi.co/api/v1/type/?limit=999";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            typeCount = response.meta.total_count;
            assignColors(response.objects);
            load();
        }
    };
    xmlhttp.open("GET", url, true);

    xmlhttp.send();
    function assignColors(types) {
        for (var i = 0; i < typeCount; i++) {
            typeColors[i] = {
                name: types[i].name,
                color: "#" + colors[i],
                lightColor: ColorLuminance(colors[i], 0.7)
            };
        }
    }


};

//http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function ColorLuminance(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    // validate hex string
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

function buildLargeCard (element) {
    element = element.getElementsByClassName("name")[0].textContent;
    for (var i = 0; i < responseCards.objects.length; i++) {
        if (responseCards.objects[i].name == element) {
            element = responseCards.objects[i];
            break;
        }
    }
    document.getElementById("largeView").style.backgroundImage = "url(\"http://pokeapi.co/media/img/" + element.national_id + ".png\")";
    document.getElementById("largeCard").getElementsByTagName("p")[0].innerHTML = element.name;
    buildTable(element);
};

function buildTable (element) {
    var table = "";
    table += "<table>";
    table += "<tr><td>Type</td><td>";
    for (var i = 0; i < element.types.length; i++)table += element.types[i].name.charAt(0).toUpperCase() + element.types[i].name.slice(1) + " ";
    table += "</td></tr>";
    table += "<tr><td>Attack</td><td>" + element.attack + "</td></tr>";
    table += "<tr><td>Defense</td><td>" + element.defense + "</td></tr>";
    table += "<tr><td>HP</td><td>" + element.hp + "</td></tr>";
    table += "<tr><td>SP Attack</td><td>" + element.sp_atk + "</td></tr>";
    table += "<tr><td>SP Defense</td><td>" + element.sp_def + "</td></tr>";
    table += "<tr><td>Speed</td><td>" + element.speed + "</td></tr>";
    table += "<tr><td>Weight</td><td>" + element.weight + "</td></tr>";
    table += "<tr><td>Total moves</td><td>" + element.moves.length + "</td></tr>";
    table += "</table>";
    document.getElementById("table").innerHTML = table;
};

function filter (type) {
    var cards = document.getElementsByClassName("card");
    if (filtered != null) {
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.display = "block";
        }
        if (filtered === type) {
            filtered = null;
            return;
        }
    }
    for (var i = 0; i < cards.length; i++) {
        var powers = cards[i].getElementsByClassName("powerType");
        var hasPower = false;
        for (var j = 0; j < powers.length; j++) {
            if (powers[j].textContent.toLowerCase() === type.toLowerCase()) {
                hasPower = true;
            }
        }
        if (!hasPower)cards[i].style.display = "none";
    }
    filtered = type;
};
