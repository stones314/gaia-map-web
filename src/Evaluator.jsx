import React from 'react';
import './Menu.css';
import { planets, colorWheel, hexTypes, getSectorArray, sectorCenter } from './Defs';

const expWgt = {
    "T0": 1.0,
    "T1": 0.7,
    "T2": 0.1,
    "T3": 0.0,
    "Ga": 1.0,
    "Tr": 0.2,
};
const nbrWgt = {
    "T0": 0.0,
    "T1": 0.0,
    "T2": 0.8,
    "T3": 1.0,
    "Ga": 0.3,
    "Tr": 0.0,
};

const distWgt = [1.0, 0.75, 0.5];


function rotate(ring, radius, n) {
    const rotated = ring.splice();
    for (const [index, planet] of ring.entries()) {
        rotated[(index + radius * n) % (radius * 6)] = planet;
    }
    return rotated;
}

export function dist(r1, c1, r2, c2) {
    return Math.max([
        Math.abs(r1 - r2),
        Math.abs(c1 - c2),
        Math.abs(-r1 - c1 - r2 + c2)]);
}

export function getRingCoord(row, col, radius) {
    if (radius === 0) {
        return [[row, col]];
    }
    if (radius === 1) {
        return [
            [row - 1, col],
            [row - 1, col + 1],
            [row, col + 1],
            [row + 1, col],
            [row + 1, col - 1],
            [row, col - 1]];
    }
    if (radius === 2) {
        return [
            [row - 2, col],
            [row - 2, col + 1],
            [row - 2, col + 2],
            [row - 1, col + 2],
            [row, col + 2],
            [row + 1, col + 1],
            [row + 2, col],
            [row + 2, col - 1],
            [row + 2, col - 2],
            [row + 1, col - 2],
            [row, col - 2],
            [row - 1, col - 1]];
    }
    if (radius === 3) {
        return [
            [row - 3, col],
            [row - 3, col + 1],
            [row - 3, col + 2],
            [row - 3, col + 3],
            [row - 2, col + 3],
            [row - 1, col + 3],
            [row, col + 3],
            [row + 1, col + 2],
            [row + 2, col + 1],
            [row + 3, col],
            [row + 3, col - 1],
            [row + 3, col - 2],
            [row + 3, col - 3],
            [row + 2, col - 3],
            [row + 1, col - 3],
            [row, col - 3],
            [row - 1, col - 2],
            [row - 2, col - 1]];
    }
    return []
}

function colorDist(p1, p2) {
    if (p1 === p2)
        return 0;
    if (p1 == "Ga" || p2 == "Ga")
        return 1;
    if (p1 == "Tr" || p2 == "Tr")
        return 3;
    var first = -1;
    var second = -1;
    for (var i = 0; i < 7; i++) {
        if (colorWheel[i] == p1 || colorWheel[i] == p2) {
            if (first == -1) {
                first = i;
            }
            else {
                second = i;
                break;
            }
        }
    }
    var dist = second - first;
    if (dist > 3)
        dist = 7 - dist;
    return dist;
}

function getRingPlanets(row, col, rad, hexMap) {
    const ringCoords = getRingCoord(row, col, rad);
    //console.error("ring coords = " + ringCoords);
    var ringPlanets = [];
    for (const [i, [r, c]] of ringCoords.entries()) {
        if (r < 0 || c < 0 || r > 16 || c > 23) {
            ringPlanets.push("No");
        }
        else {
            ringPlanets.push(hexMap[r][c]["Type"]);
        }
    }
    return ringPlanets;
}

export function makeHexMap(sectors, rotations) {
    var hexMap = [];
    for (var i = 0; i < 17; i++) {
        hexMap.push([]);
        for (var j = 0; j < 24; j++) {
            hexMap[i].push({
                "Row": 0,
                "Col": 0,
                "Type": "No",
                "Sec": "s00",
                "Rot": 0,
                "Slot": 0,
                "Re": [0, 0, 0],
                "Bl": [0, 0, 0],
                "Wh": [0, 0, 0],
                "Bk": [0, 0, 0],
                "Br": [0, 0, 0],
                "Ye": [0, 0, 0],
                "Or": [0, 0, 0],
                "Ga": [0, 0, 0],
                "Tr": [0, 0, 0],
                "Em": [0, 0, 0],
                "No": [0, 0, 0],
                "T0": [0, 0, 0],
                "T1": [0, 0, 0],
                "T2": [0, 0, 0],
                "T3": [0, 0, 0],
                "Nbr": [0, 0, 0],
                "Visited": 0,
            });
        }
    }

    for (const [index, sector] of sectors.entries()) {
        var hexes = getSectorArray(sector);
        var row = sectorCenter[index][0];
        var col = sectorCenter[index][1];
        var rad = 0;
        hexMap[row][col]["Type"] = hexes[rad][0];
        hexMap[row][col]["Sec"] = sector;
        hexMap[row][col]["Rot"] = rotations[index];
        hexMap[row][col]["Slot"] = index;
        hexMap[row][col]["Row"] = row;
        hexMap[row][col]["Col"] = col;

        for (rad = 1; rad < 3; rad++) {
            var ringCoords = getRingCoord(row, col, rad);
            var ringPlanets = rotate(hexes[rad], rad, rotations[index]);
            for (const [ringId, [r, c]] of ringCoords.entries()) {
                hexMap[r][c]["Type"] = ringPlanets[ringId];
                hexMap[r][c]["Sec"] = sector;
                hexMap[r][c]["Rot"] = rotations[index];
                hexMap[r][c]["Slot"] = index;
                hexMap[r][c]["Row"] = r;
                hexMap[r][c]["Col"] = c;
            }
        }
    }

    return hexMap;
}

function isOutsideMap(hexType) {
    return (hexType === "No" || hexType === "Fr");
}

function isPlanet(hexType) {
    return (hexType !== "No" && hexType !== "Fr" && hexType !== "Em")
}

function isTerraformable(hexType) {
    return (isPlanet(hexType) && hexType !== "Tr" && hexType != "Ga")
}

export function getNeighbourInfo(hexMap) {
 
    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, hex] of hexes.entries()) {
            if (isPlanet(hex["Type"])) {
                for (var rad = 1; rad < 4; rad++) {
                    var ringPlanets = getRingPlanets(row, col, rad, hexMap);
                    for (const [i, neighbour] of ringPlanets.entries()) {
                        if (isOutsideMap(neighbour)) {
                            hex["No"][rad - 1]++;
                        }
                        else {
                            hex[neighbour][rad - 1]++;
                            if (neighbour != "Em")
                                hex["Nbr"][rad - 1]++;
                        }
                        if (isTerraformable(hex["Type"]) && isTerraformable(neighbour)) {
                            var terraCost = "T" + colorDist(hex["Type"], neighbour);
                            hex[terraCost][rad - 1]++;
                        }
                    }
                }
            }
        }
    }
}

function evaluatePlanetHappiness(hexMap) {

    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, hex] of hexes.entries()) {

        }
    }
    return hexMap;
}

export function getNeighbourMatrix(hexMap) {
    var nbrMat = {};
    for (const [i, planet] of planets.entries()) {
        nbrMat[planet] = {};
        for (const [j, neighbour] of hexTypes.entries()) {
            nbrMat[planet][neighbour] = [0, 0, 0];
        }
    }

    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, hexInfo] of hexes.entries()) {
            var neighbour = hexInfo["Type"];
            if (neighbour === "Fr")
                neighbour = "No";
            for (const [i, planet] of planets.entries()) {
                nbrMat[planet][neighbour][0] += hexInfo[planet][0];
                nbrMat[planet][neighbour][1] += hexInfo[planet][1];
                nbrMat[planet][neighbour][2] += hexInfo[planet][2];
            }
        }
    }
    return nbrMat;
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
            if (nbrMat[planet][planet][rad-1] > 0)
                return true;
        }
    }
    return false;
}

export function getExpNbrStats(nbrMat) {
    var expNbrStats = {};
    var exp = 0;
    var nbr = 1;
    for (const [i, planet] of colorWheel.entries()) {
        expNbrStats[planet] = {
            "T0": [0.0, 0.0],
            "T1": [0.0, 0.0],
            "T2": [0.0, 0.0],
            "T3": [0.0, 0.0],
            "Ga": [0.0, 0.0],
            "Tr": [0.0, 0.0],
            "Su": [0.0, 0.0]
        };
        for (const [j, neighbour] of planets.entries()) {
            var nbrType = "T" + colorDist(planet, neighbour);
            if (neighbour === "Ga" || neighbour === "Tr") {
                nbrType = neighbour;
            }
            for (const [r, count] of nbrMat[planet][neighbour].entries()) {
                expNbrStats[planet][nbrType][exp] += count * expWgt[nbrType] * distWgt[r];
                if (r < 2)
                    expNbrStats[planet][nbrType][nbr] += count * nbrWgt[nbrType];
            }
            expNbrStats[planet]["Su"][exp] += expNbrStats[planet][nbrType][exp];
            expNbrStats[planet]["Su"][nbr] += expNbrStats[planet][nbrType][nbr];
        }
    }
    var balance = {}
    for (const [i, planet] of colorWheel.entries())
        balance[planet] = expNbrStats[planet]["Su"];

    return balance;
}

export function randomizeMap(sectors, rotations, withSwap) {
    var n = sectors.length;
    if (withSwap) {
        for (var i = 0; i < n; i++) {
            if (sectors[i] !== "s00") {
                var j = Math.floor(Math.random() * n);
                while (sectors[j] === "s00") {
                    j = Math.floor(Math.random() * n);
                }
                [sectors[i], sectors[j]] = [sectors[j], sectors[i]];
            }
        }
    }
    for (var i = 0; i < n; i++) {
        if (sectors[i] !== "s00") {
            var r = Math.floor(Math.random() * 6);
            rotations[i] = r;
        }
    }
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

export function evaluateMap(sectors, rotations, debug) {
    var hexMap = makeHexMap(sectors, rotations);
    getNeighbourInfo(hexMap);
    var nbrMat = getNeighbourMatrix(hexMap);
    if (hasEqualNeighbour(nbrMat, 2))
        return -1.0;
    var balance = getExpNbrStats(nbrMat);
    var score = getScalarBalance(balance);
    return score;
}

function getMapValidity(sectors, rotations, criteria) {
    /*
     * Return values:
     * 0 - map is valid
     * 1 - failed on minimum equal dist
     */
    var hexMap = makeHexMap(sectors, rotations);
    getNeighbourInfo(hexMap);
    var nbrMat = getNeighbourMatrix(hexMap);
    if (hasEqualNeighbour(nbrMat, criteria.minEqDist))
        return 1;
    return 0;
}

export function getRandomValidMap(sectors, rotations, criteria, withSwap) {
    randomizeMap(sectors, rotations, withSwap);
    var failures = 0;
    while (getMapValidity(sectors, rotations, criteria) > 0) {
        failures++;
        if (failures > criteria.maxFail)
            return [false, failures];
        randomizeMap(sectors, rotations, withSwap);
    }
    return [true, failures];
}

export function optimizeMap(sectors, rotations, withSwap) {
    var tryCount = 1000;
    var bestScore = 1000.0;
    var bestSec = sectors.slice();
    var bestRot = rotations.slice();
    var totEval = 0;
    for (var t = 0; t < tryCount; t++) {
        var illegal = 0;
        randomizeMap(sectors, rotations, withSwap);
        var score = evaluateMap(sectors, rotations, false);
        totEval++;
        while (score < 0.0 && illegal < 1000) {
            illegal++;
            randomizeMap(sectors, rotations, withSwap);
            score = evaluateMap(sectors, rotations, false);
            totEval++;
        }
        if (illegal < 1000) {
            if (score < bestScore) {
                bestScore = score;
                bestSec = sectors.slice();
                bestRot = rotations.slice();
            }
        }
    }
    for (var i = 0; i < sectors.length; i++) {
        sectors[i] = bestSec[i];
        rotations[i] = bestRot[i];
    }
    console.error("iterations: " + totEval);

    evaluateMap(sectors, rotations, true);
    return bestScore;
}