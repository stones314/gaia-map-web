import { planets, colorWheel } from './../Defs';
import { makeHexGrid, updateNeighbourInfo, getNeighbourMatrix, getExpNbrStats } from './MapInformation';
import { isTerraformable } from './Basics';

export function getMapValidity(hexGrid, nbrMat, criteria) {
    /*
     * Return values:
     * 0 - map is valid
     * 1 - failed on minimum equal dist
     */
    if (hasEqualNeighbour(nbrMat, criteria.minEqDist))
        return 1;
    return 0;
}

export function hasEqualNeighbour(nbrMat, minEqDist) {
    for (const [i, planet] of planets.entries()) {
        if (planet === "Tr")
            continue;
        if (nbrMat[planet][planet][0] > 0)
            return true;
        if (planet === "Ga")
            continue;
        for (var rad = 2; rad < minEqDist; rad++) {
            if (nbrMat[planet][planet][rad - 1] > 0) {
                return true;
            }
        }
    }
    return false;
}

export function getHighestEdgeCount(nbrMat, maxEdgeCount) {
    var max = 0;
    var p = [];
    for (const [i, planet] of colorWheel.entries()) {
        var edgeCount = nbrMat[planet]["No"][0];
        if (edgeCount > max) {
            max = edgeCount;
        }
        if (edgeCount > maxEdgeCount) {
            p.push(planet);
        }
    }
    return [p, max];
}

const expandHappy = {
    "T0": 0.8,
    "T1": 1.0,
    "T2": 0.0,
    "T3": 0.0,
    "Ga": 1.0,
    "Tr": 0.2,
}
const leechHappy = {
    "T0": 0.0,
    "T1": 0.0,
    "T2": 1.0,
    "T3": 1.0,
    "Ga": 0.0,
    "Tr": 0.0,
}
const nbrQual = ["T0", "T1", "T2", "T3", "Ga", "Tr",]
const rangeWeight = [1.0, 1.0, 0.5];
const edgeSadness = [0.3, 0.1, 0.0];
const comboBonus = [
    [0.1, 0.3, 0.6],
    [0.3, 0.6, 0.9],
    [0.6, 0.9, 1.0],
];

export function evaluatePlanetHappiness(hexGrid, ignoreNum = 0) {
    var colorHappy = {
        "Re": 0.0,
        "Bl": 0.0,
        "Wh": 0.0,
        "Bk": 0.0,
        "Br": 0.0,
        "Ye": 0.0,
        "Or": 0.0,
    }

    var numPlan = 0;

    for (const [row, hexes] of hexGrid.entries()) {
        for (const [col, hex] of hexes.entries()) {
            if (isTerraformable(hex["Type"])) {
                if (hex["Type"] === "Re")
                    numPlan++;
                hex["Happy"] = 0.0;
                //Add happiness if easy to expand, or easy to leech:
                var e = 0;
                var leech = 0;
                for (var rad = 0; rad < 3; rad++) {
                    for (const [i, nbrQ] of nbrQual.entries()) {
                        if (rad < 2) {
                            hex["Happy"] += hex[nbrQ][rad] * leechHappy[nbrQ];
                            leech += hex[nbrQ][rad] * leechHappy[nbrQ];
                        }
                        hex["Happy"] += hex[nbrQ][rad] * expandHappy[nbrQ] * rangeWeight[rad];
                        e += hex[nbrQ][rad] * expandHappy[nbrQ];
                    }
                }
                if (hex["No"][0] > 0)
                    hex["Happy"] *= (1.0 - edgeSadness[0]);
                if (hex["No"][1] > 0)
                    hex["Happy"] *= (1.0 - edgeSadness[1]);
                if (leech > 2) leech = 2;
                if (e > 2) e = 2;
                //hex["Happy"] *= comboBonus[Math.floor(leech)][Math.floor(e)];

                colorHappy[hex["Type"]] += hex["Happy"];
            }
        }
    }

    var minScore = 2.0 * numPlan;
    var maxScore = 5.5 * numPlan;
    var myArr = [];
    for (const [i, planet] of colorWheel.entries()) {
        //best score I have seen was 42 for 6 planets, so set 7.1 per planet to 100%
        //worst score was about 3 per planet, so set 1.2 to be 0%
        var ch = 100.0 * (colorHappy[planet] - minScore) / (maxScore - minScore);
        //ch = colorHappy[planet];
        myArr.push([planet, ch.toFixed(0)]);
    }

    // Sort the array based on the second element
    myArr.sort(function (first, second) {
        return second[1] - first[1];
    });

    var diff = myArr[0][1] - myArr[6 - ignoreNum][1];
    var balance = 100-diff;
    myArr.push(["Balance", balance.toFixed(0)]);

    return myArr;
}


function getScalarBalance(balance) {
    var max = 0.0;
    var min = 100000.0;
    for (const [i, planet] of colorWheel.entries()) {
        var tot = balance[planet][0] + balance[planet][1] - (Math.abs(balance[planet][0] - balance[planet][1]));
        if (tot > max)
            max = tot;
        else if (tot < min)
            min = tot;
    }
    return max - min;
}

export function evaluate(hexGrid, nbrMat, debug) {
    var balance = getExpNbrStats(nbrMat);
    var score = getScalarBalance(balance);
    return score;
}



export function evaluateMap(sectors, rotations, debug) {
    var hexGrid = makeHexGrid(sectors, rotations);
    updateNeighbourInfo(hexGrid);
    var nbrMat = getNeighbourMatrix(hexGrid);
    if (hasEqualNeighbour(nbrMat, 2))
        return -1.0;
    var balance = getExpNbrStats(nbrMat);
    var score = getScalarBalance(balance);
    return score;
}


