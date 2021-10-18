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
                "Visited": 0,
                "Re": 7,
                "Bl": 7,
                "Wh": 7,
                "Bk": 7,
                "Br": 7,
                "Ye": 7,
                "Or": 7,
                "Ga": 7,
                "Tr": 7,
                "Em": [0, 0, 0],
                "No": [0, 0, 0],
                "Fr": [0, 0, 0],
                "Row": 0,
                "Col": 0,
                "Type": "No",
                "Sec": "s00",
                "Rot": 0,
                "Slot": 0,
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

        for (rad = 1; rad < 3; rad++) {
            var ringCoords = getRingCoord(row, col, rad);
            var ringPlanets = rotate(hexes[rad], rad, rotations[index]);
            for (const [ringId, [r, c]] of ringCoords.entries()) {
                hexMap[r][c]["Type"] = ringPlanets[ringId];
                hexMap[r][c]["Sec"] = sector;
                hexMap[r][c]["Rot"] = rotations[index];
                hexMap[r][c]["Slot"] = index;
            }
        }
    }

    return hexMap;
}


export function makeInfoMap(hexMap) {
 
    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, planet] of hexes.entries()) {
            hexMap[row][col]["Row"] = row;
            hexMap[row][col]["Col"] = col;
            hexMap[row][col]["Type"] = planet["Type"];
            hexMap[row][col]["Sec"] = hexMap[row][col]["Sec"];
            hexMap[row][col]["Rot"] = hexMap[row][col]["Rot"];
            hexMap[row][col]["Slot"] = hexMap[row][col]["Slot"];
            if (planet["Type"] != "No" && planet["Type"] != "Em" && planet["Type"] != "Fr") {
                for (var rad = 1; rad < 4; rad++) {
                    var ringPlanets = getRingPlanets(row, col, rad, hexMap);
                    for (const [i, neighbour] of ringPlanets.entries()) {
                        if (neighbour == "No" || neighbour === "Em" || neighbour === "Fr") {
                            hexMap[row][col][neighbour][rad - 1]++;
                        }
                        else if (hexMap[row][col][neighbour] > rad){
                            hexMap[row][col][neighbour] = rad;
                        }
                    }
                }
            }
        }
    }
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
            var neighbour = hexMap[row][col]["Type"];
            for (const [i, planet] of planets.entries()) {
                var nbrDist = hexInfo[planet];
                if (nbrDist < 7)
                    nbrMat[planet][neighbour][nbrDist - 1]++;
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

export function evaluateMap(sectors, rotations) {
    var hexMap = makeHexMap(sectors, rotations);
    makeInfoMap(hexMap);
    var nbrMat = getNeighbourMatrix(hexMap);
    var hasEqNbr = hasEqualNeighbour(nbrMat, 2);
    var balance = getExpNbrStats(nbrMat);
}

export function optimizeMap(sectors, rotations, withSwap) {
    var tryCount = 100;
    for (var t = 0; t < tryCount; t++) {
        randomizeMap(sectors, rotations, withSwap);

    }
}