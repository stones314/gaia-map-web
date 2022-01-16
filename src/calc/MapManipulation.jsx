import { getMapValidity, evaluateMap, evaluate } from './MapEvaluation.jsx';
import { sectorCenter, sectorToLetter, sectorFromLetter } from '../Defs.jsx';
import { getSectorCoords } from './Basics.jsx';
import { updateNeighbourMatrix, updateNeighbourInfo } from './MapInformation.jsx';

function updateSectorValues(hexGrid, slot, values) {
    for (const [i, [rad, row, col]] of getSectorCoords(slot).entries()) {
        for (const [j, [key, value]] of values.entries()) {
            hexGrid[row][col][key] = value;
        }
    }
}

export function rotateSec(hexGrid, slot) {
    var row = sectorCenter[slot][0];
    var col = sectorCenter[slot][1];

    //radius === 1
    [
        hexGrid[row - 1][col    ],
        hexGrid[row - 1][col + 1],
        hexGrid[row    ][col + 1],
        hexGrid[row + 1][col    ],
        hexGrid[row + 1][col - 1],
        hexGrid[row][col - 1]]
        = [
            hexGrid[row][col - 1],
            hexGrid[row - 1][col    ],
            hexGrid[row - 1][col + 1],
            hexGrid[row    ][col + 1],
            hexGrid[row + 1][col    ],
            hexGrid[row + 1][col - 1]];
    
    //radius === 2) {
    [
        hexGrid[row - 2][col    ],
        hexGrid[row - 2][col + 1],
        hexGrid[row - 2][col + 2],
        hexGrid[row - 1][col + 2],
        hexGrid[row    ][col + 2],
        hexGrid[row + 1][col + 1],
        hexGrid[row + 2][col    ],
        hexGrid[row + 2][col - 1],
        hexGrid[row + 2][col - 2],
        hexGrid[row + 1][col - 2],
        hexGrid[row][col - 2],
        hexGrid[row - 1][col - 1]]
        = [
            hexGrid[row][col - 2],
            hexGrid[row - 1][col - 1],
            hexGrid[row - 2][col],
            hexGrid[row - 2][col + 1],
            hexGrid[row - 2][col + 2],
            hexGrid[row - 1][col + 2],
            hexGrid[row    ][col + 2],
            hexGrid[row + 1][col + 1],
            hexGrid[row + 2][col],
            hexGrid[row + 2][col - 1],
            hexGrid[row + 2][col - 2],
            hexGrid[row + 1][col - 2]];

    updateSectorValues(hexGrid, slot, [["Rot", (hexGrid[row][col]["Rot"] + 1) % 6]]);
}

export function swapSec(hexGrid, slotA, slotB) {
    var rA = sectorCenter[slotA][0];
    var cA = sectorCenter[slotA][1];
    var rB = sectorCenter[slotB][0];
    var cB = sectorCenter[slotB][1];

    [
        hexGrid[rA][cA],
        hexGrid[rA][cA - 1],
        hexGrid[rA - 1][cA],
        hexGrid[rA - 1][cA + 1],
        hexGrid[rA][cA + 1],
        hexGrid[rA + 1][cA],
        hexGrid[rA + 1][cA - 1],
        hexGrid[rA][cA - 2],
        hexGrid[rA - 1][cA - 1],
        hexGrid[rA - 2][cA],
        hexGrid[rA - 2][cA + 1],
        hexGrid[rA - 2][cA + 2],
        hexGrid[rA - 1][cA + 2],
        hexGrid[rA][cA + 2],
        hexGrid[rA + 1][cA + 1],
        hexGrid[rA + 2][cA],
        hexGrid[rA + 2][cA - 1],
        hexGrid[rA + 2][cA - 2],
        hexGrid[rA + 1][cA - 2],

        hexGrid[rB][cB],
        hexGrid[rB][cB - 1],
        hexGrid[rB - 1][cB],
        hexGrid[rB - 1][cB + 1],
        hexGrid[rB][cB + 1],
        hexGrid[rB + 1][cB],
        hexGrid[rB + 1][cB - 1],
        hexGrid[rB][cB - 2],
        hexGrid[rB - 1][cB - 1],
        hexGrid[rB - 2][cB],
        hexGrid[rB - 2][cB + 1],
        hexGrid[rB - 2][cB + 2],
        hexGrid[rB - 1][cB + 2],
        hexGrid[rB][cB + 2],
        hexGrid[rB + 1][cB + 1],
        hexGrid[rB + 2][cB],
        hexGrid[rB + 2][cB - 1],
        hexGrid[rB + 2][cB - 2],
        hexGrid[rB + 1][cB - 2]
    ] = [
            hexGrid[rB][cB],
            hexGrid[rB][cB - 1],
            hexGrid[rB - 1][cB],
            hexGrid[rB - 1][cB + 1],
            hexGrid[rB][cB + 1],
            hexGrid[rB + 1][cB],
            hexGrid[rB + 1][cB - 1],
            hexGrid[rB][cB - 2],
            hexGrid[rB - 1][cB - 1],
            hexGrid[rB - 2][cB],
            hexGrid[rB - 2][cB + 1],
            hexGrid[rB - 2][cB + 2],
            hexGrid[rB - 1][cB + 2],
            hexGrid[rB][cB + 2],
            hexGrid[rB + 1][cB + 1],
            hexGrid[rB + 2][cB],
            hexGrid[rB + 2][cB - 1],
            hexGrid[rB + 2][cB - 2],
            hexGrid[rB + 1][cB - 2],

            hexGrid[rA][cA],
            hexGrid[rA][cA - 1],
            hexGrid[rA - 1][cA],
            hexGrid[rA - 1][cA + 1],
            hexGrid[rA][cA + 1],
            hexGrid[rA + 1][cA],
            hexGrid[rA + 1][cA - 1],
            hexGrid[rA][cA - 2],
            hexGrid[rA - 1][cA - 1],
            hexGrid[rA - 2][cA],
            hexGrid[rA - 2][cA + 1],
            hexGrid[rA - 2][cA + 2],
            hexGrid[rA - 1][cA + 2],
            hexGrid[rA][cA + 2],
            hexGrid[rA + 1][cA + 1],
            hexGrid[rA + 2][cA],
            hexGrid[rA + 2][cA - 1],
            hexGrid[rA + 2][cA - 2],
            hexGrid[rA + 1][cA - 2],
        ];
    updateSectorValues(hexGrid, slotA, [["Slot", slotA]]);
    updateSectorValues(hexGrid, slotB, [["Slot", slotB]]);
}

function rotateRandomSec(hexGrid, sectors, rotations) {
    var i = Math.floor(Math.random() * 11);
    while (sectors[i] === "s00") {
        i = Math.floor(Math.random() * 11);
    }
    rotations[i] = (rotations[i] + 1) % 6;
    rotateSec(hexGrid, i);
}

function swapRandomSec(hexGrid, sectors, rotations) {
    var i = Math.floor(Math.random() * 11);
    while (sectors[i] === "s00") {
        i = Math.floor(Math.random() * 11);
    }
    var j = Math.floor(Math.random() * 11);
    while (sectors[j] === "s00" || j === i) {
        j = Math.floor(Math.random() * 11);
    }
    [sectors[i], sectors[j]] = [sectors[j], sectors[i]];
    [rotations[i], rotations[j]] = [rotations[j], rotations[i]];
    swapSec(hexGrid, i, j);
}

export function randomizeOnce(hexGrid, sectors, rotations, withSwap) {
    if (withSwap) {
        var i = Math.random() * 2;
        if (i < 1) {
            swapRandomSec(hexGrid, sectors, rotations);
        } else {
            rotateRandomSec(hexGrid, sectors, rotations);
        }
    } else {
        rotateRandomSec(hexGrid, sectors, rotations);
    }
}

export function getRandomValidMap(hexGrid, nbrMat, sectors, rotations, withSwap, criteria) {
    randomizeOnce(hexGrid, nbrMat, sectors, rotations, withSwap);

    var failures = 1;
    while (getMapValidity(hexGrid, nbrMat, criteria) > 0) {
        failures++;
        if (failures > criteria.maxFail)
            return [false, failures];
        randomizeOnce(hexGrid, nbrMat, sectors, rotations, withSwap);
    }
    return [true, failures];
}


export function optimize(hexGrid, nbrMat, sectors, rotations, withSwap, criteria) {
    var tryCount = 1000;
    var bestScore = 1000.0;
    var bestSec = sectors.slice();
    var bestRot = rotations.slice();
    var totEval = 0;
    for (var t = 0; t < tryCount; t++) {
        var [ok, failures] = getRandomValidMap(hexGrid, nbrMat, sectors, rotations, withSwap, criteria);
        var score = evaluate(hexGrid, nbrMat, false);
        if (failures < criteria.maxFail) {
            if (score < bestScore) {
                bestScore = score;
                bestSec = sectors.slice();
                bestRot = rotations.slice();
            }
        }
        totEval += failures;
    }
    for (var i = 0; i < sectors.length; i++) {
        sectors[i] = bestSec[i];
        rotations[i] = bestRot[i];
    }
    console.error("iterations: " + totEval);

    evaluate(hexGrid, nbrMat, true);
    return bestScore;
}

/*
 * OLD: Using secotrs and rotations to store state
 * and creating a new hexGrid every time we shall evaluate or display it.
 **/

export function rotate(ring, radius, n) {
    const rotated = ring.splice();
    for (const [index, planet] of ring.entries()) {
        rotated[(index + radius * n) % (radius * 6)] = planet;
    }
    return rotated;
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

export function getRandomValidMap2(sectors, rotations, criteria, withSwap) {
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

const sectorVal = {
    "s00": 0,
    "s01": 1,
    "s02": 2,
    "s03": 4,
    "s04": 8,
    "s05": 16,
    "s05b": 32,
    "s06": 64,
    "s06b": 128,
    "s07": 256,
    "s07b": 512,
    "s08": 1024,
    "s09": 2048,
    "s10": 4096,
};

const sectorList = [ "s00","s01","s02","s03","s04","s05","s05b","s06","s06b","s07","s07b","s08","s09","s10" ];
const rotList = ["0", "1", "2", "3", "4", "5", "00", "01", "02", "03", "04", "05"];

const rotListNew = ["0", "1", "2", "3", "4", "5"];

function getSecOptHashVal(numSec, secOpt) {
    return 0;
}

function getSecOptFromHash(mapHash) {
    return [0, 0];
}

function validSec(sec) {
    for (const [i, s] of sectorList.entries()) {
        if (sec === s) return true;
    }
    return false;
}

function validRot(rot) {
    for (const [i, r] of rotList.entries()) {
        if (rot === r) return true;
    }
    return false;
}

function getSecOpt(mapHash, numSec) {
    //7519	6831	7527	1375	687	1383	5722	2461	6685
    if (numSec === 10 && mapHash === 7519)
        return 0;
    if (numSec === 9 && mapHash === 6831)
        return 0;
    if (numSec === 9 && mapHash === 7527)
        return 1;
    if (numSec === 8 && mapHash === 1375)
        return 0;
    if (numSec === 7 && mapHash === 687)
        return 0;
    if (numSec === 7 && mapHash === 1383)
        return 1;
    if (numSec === 7 && mapHash === 5722)
        return 2;
    if (numSec === 7 && mapHash === 2461)
        return 3;
    if (numSec === 7 && mapHash === 6685)
        return 4;
    return -1;
}

function convertOldMapString(mapString) {
    var out = {
        valid: false,
        sectors: [],
        rotations: [],
        numSec: 0,
        secOpt: 0,
        errorMsg: "",
        mapHash: 0,
    }
    const parts = mapString.split("-");
    if (parts.length != 12) {
        out.errorMsg = "Incorrect [old] map string, it must be 12 sector.rotation pairs separated with - ";
        return out;
    }
    for (const [i, p] of parts.entries()) {
        if (i === 11) break;
        const s = p.split('.');
        if (s.length != 2) {
            out.errorMsg = "Incorrect [old] map string, " + s + " could not be parsed as sector.rotation.";
            return out;
        }
        if (!validSec(s[0])) {
            out.errorMsg = "Incorrect [old] map string, " + s[0] + " is not a valid sector.";
            return out;
        }
        out.sectors.push(s[0]);
        if (!validRot(s[1])) {
            out.errorMsg = "Incorrect [old] map string, " + s[1] + " is not a valid rotation.";
            return out;
        }
        out.rotations.push(parseInt(s[1]));
        out.mapHash += sectorVal[s[0]];
        if (s[0] != "s00")
            out.numSec++;
    }
    out.secOpt = getSecOpt(out.mapHash, out.numSec);
    if (out.secOpt < 0) {
        out.errorMsg = "Incorrect [old] map string, not a valid combination of sectors.";
        return out;
    }
    out.valid = true;
    return out;
}

export function convertMapString(mapString) {
    const parts = mapString.split("-");
    if (parts.length > 1)
        return convertOldMapString(mapString);

    var out = {
        valid: false,
        sectors: [],
        rotations: [],
        numSec: 0,
        secOpt: 0,
        errorMsg: "",
        mapHash: 0,
    }
    if (mapString.length != 22) {
        out.errorMsg = "Incorrect map string, must have 22 characters.";
        return out;
    }
    for (var i = 0; i < 11; i++) {
        if (!validSec(sectorFromLetter[mapString[i*2]])) {
            out.errorMsg = "Incorrect map string, " + mapString[i * 2] + " is not a valid sector.";
            return out;
        }
        out.sectors.push(sectorFromLetter[mapString[i * 2]]);
        if (!validRot(mapString[i * 2 + 1])) {
            out.errorMsg = "Incorrect map string, " + mapString[i * 2 + 1] + " is not a valid rotation.";
            return out;
        }
        out.rotations.push(parseInt(mapString[i * 2 + 1]));
        out.mapHash += sectorVal[sectorFromLetter[mapString[i * 2]]];
        if (mapString[i * 2] != "A")
            out.numSec++;
    }
    out.secOpt = getSecOpt(out.mapHash, out.numSec);
    if (out.secOpt < 0) {
        out.errorMsg = "Incorrect map string, not a valid combination of sectors.";
        return out;
    }
    out.valid = true;
    return out;

}
