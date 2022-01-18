import { planets, colorWheel, metrics } from './../Defs';
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
    "T0": 1.0,
    "T1": 0.8,
    "T2": 0.0,
    "T3": 0.0,
    "Ga": 0.8,
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
const rangeWeight = [1.0, 1.0, 1.0];
const edgeSadness = [2.0, 1.2, 0.2];

export function evaluatePlanetHappiness(hexGrid, mapHappiness) {
    for (const [i, m] of metrics.entries()) {
        mapHappiness.colorHappy["Max"].score[m] = 0.0;
        for (const [j, p] of colorWheel.entries()) {
            mapHappiness.colorHappy[p].score[m] = 0.0;
        }
    }

    for (const [row, hexes] of hexGrid.entries()) {
        for (const [col, hex] of hexes.entries()) {
            if (isTerraformable(hex["Type"])) {
                for (const [i, m] of metrics.entries())
                    hex[m] = 0.0;
                //Add happiness if easy to expand, or easy to leech:
                for (var rad = 0; rad < 3; rad++) {
                    for (const [i, nbrQ] of nbrQual.entries()) {
                        if (rad < 2) {
                            hex["Leech"] += hex[nbrQ][rad] * leechHappy[nbrQ];
                        }
                        hex["Exp"] += hex[nbrQ][rad] * expandHappy[nbrQ] * rangeWeight[rad];
                    }
                }
                if (hex["No"][0] > 0)
                    hex["EdgSad"] += edgeSadness[0];
                if (hex["No"][1] > 0)
                    hex["EdgSad"] += edgeSadness[1];

                for (const [i, m] of metrics.entries())
                    mapHappiness.colorHappy[hex["Type"]].score[m] += hex[m];

                hex["Happy"] = hex["Exp"] + hex["Leech"] - hex["EdgSad"];
            }
        }
    }
    mapHappiness.update();
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


