import { getMapValidity, evaluateMap } from './MapEvaluation.jsx';
import { sectorCenter } from '../Defs.jsx';
import { getRingCoords } from './Basics.jsx';

export function rotateSec(hexMap, slot) {
    var row = sectorCenter[slot][0];
    var col = sectorCenter[slot][1];

    //radius === 1
    [
        hexMap[row - 1][col    ],
        hexMap[row - 1][col + 1],
        hexMap[row    ][col + 1],
        hexMap[row + 1][col    ],
        hexMap[row + 1][col - 1],
        hexMap[row][col - 1]]
        = [
            hexMap[row][col - 1],
            hexMap[row - 1][col    ],
            hexMap[row - 1][col + 1],
            hexMap[row    ][col + 1],
            hexMap[row + 1][col    ],
            hexMap[row + 1][col - 1]];
    
    //radius === 2) {
    [
        hexMap[row - 2][col    ],
        hexMap[row - 2][col + 1],
        hexMap[row - 2][col + 2],
        hexMap[row - 1][col + 2],
        hexMap[row    ][col + 2],
        hexMap[row + 1][col + 1],
        hexMap[row + 2][col    ],
        hexMap[row + 2][col - 1],
        hexMap[row + 2][col - 2],
        hexMap[row + 1][col - 2],
        hexMap[row][col - 2],
        hexMap[row - 1][col - 1]]
        = [
            hexMap[row][col - 2],
            hexMap[row - 1][col - 1],
            hexMap[row - 2][col],
            hexMap[row - 2][col + 1],
            hexMap[row - 2][col + 2],
            hexMap[row - 1][col + 2],
            hexMap[row    ][col + 2],
            hexMap[row + 1][col + 1],
            hexMap[row + 2][col],
            hexMap[row + 2][col - 1],
            hexMap[row + 2][col - 2],
            hexMap[row + 1][col - 2]];

    hexMap[row][col]["Rot"] = (hexMap[row][col]["Rot"] + 1) % 6;
}

export function swapSec(hexMap, slotA, slotB) {
    var rA = sectorCenter[slotA][0];
    var cA = sectorCenter[slotA][1];
    var rB = sectorCenter[slotB][0];
    var cB = sectorCenter[slotB][1];

    [
        hexMap[rA][cA],
        hexMap[rA][cA - 1],
        hexMap[rA - 1][cA],
        hexMap[rA - 1][cA + 1],
        hexMap[rA][cA + 1],
        hexMap[rA + 1][cA],
        hexMap[rA + 1][cA - 1],
        hexMap[rA][cA - 2],
        hexMap[rA - 1][cA - 1],
        hexMap[rA - 2][cA],
        hexMap[rA - 2][cA + 1],
        hexMap[rA - 2][cA + 2],
        hexMap[rA - 1][cA + 2],
        hexMap[rA][cA + 2],
        hexMap[rA + 1][cA + 1],
        hexMap[rA + 2][cA],
        hexMap[rA + 2][cA - 1],
        hexMap[rA + 2][cA - 2],
        hexMap[rA + 1][cA - 2],

        hexMap[rB][cB],
        hexMap[rB][cB - 1],
        hexMap[rB - 1][cB],
        hexMap[rB - 1][cB + 1],
        hexMap[rB][cB + 1],
        hexMap[rB + 1][cB],
        hexMap[rB + 1][cB - 1],
        hexMap[rB][cB - 2],
        hexMap[rB - 1][cB - 1],
        hexMap[rB - 2][cB],
        hexMap[rB - 2][cB + 1],
        hexMap[rB - 2][cB + 2],
        hexMap[rB - 1][cB + 2],
        hexMap[rB][cB + 2],
        hexMap[rB + 1][cB + 1],
        hexMap[rB + 2][cB],
        hexMap[rB + 2][cB - 1],
        hexMap[rB + 2][cB - 2],
        hexMap[rB + 1][cB - 2]
    ] = [
            hexMap[rB][cB],
            hexMap[rB][cB - 1],
            hexMap[rB - 1][cB],
            hexMap[rB - 1][cB + 1],
            hexMap[rB][cB + 1],
            hexMap[rB + 1][cB],
            hexMap[rB + 1][cB - 1],
            hexMap[rB][cB - 2],
            hexMap[rB - 1][cB - 1],
            hexMap[rB - 2][cB],
            hexMap[rB - 2][cB + 1],
            hexMap[rB - 2][cB + 2],
            hexMap[rB - 1][cB + 2],
            hexMap[rB][cB + 2],
            hexMap[rB + 1][cB + 1],
            hexMap[rB + 2][cB],
            hexMap[rB + 2][cB - 1],
            hexMap[rB + 2][cB - 2],
            hexMap[rB + 1][cB - 2],

            hexMap[rA][cA],
            hexMap[rA][cA - 1],
            hexMap[rA - 1][cA],
            hexMap[rA - 1][cA + 1],
            hexMap[rA][cA + 1],
            hexMap[rA + 1][cA],
            hexMap[rA + 1][cA - 1],
            hexMap[rA][cA - 2],
            hexMap[rA - 1][cA - 1],
            hexMap[rA - 2][cA],
            hexMap[rA - 2][cA + 1],
            hexMap[rA - 2][cA + 2],
            hexMap[rA - 1][cA + 2],
            hexMap[rA][cA + 2],
            hexMap[rA + 1][cA + 1],
            hexMap[rA + 2][cA],
            hexMap[rA + 2][cA - 1],
            hexMap[rA + 2][cA - 2],
            hexMap[rA + 1][cA - 2],
        ];
}

export function rotate(ring, radius, n) {
    const rotated = ring.splice();
    for (const [index, planet] of ring.entries()) {
        rotated[(index + radius * n) % (radius * 6)] = planet;
    }
    return rotated;
}

function rotateRandomSec(hexMap, sectors, rotations) {
    var i = Math.floor(Math.random() * 12);
    while (sectors[i] === "s00") {
        i = Math.floor(Math.random() * 12);
    }
    rotations[i] = (rotations[i] + 1) % 6;
    rotateSec(hexMap, i);
}

function swapRandomSec(hexMap, sectors, rotations) {
    var i = Math.floor(Math.random() * 12);
    while (sectors[i] === "s00") {
        i = Math.floor(Math.random() * 12);
    }
    var j = Math.floor(Math.random() * 12);
    while (sectors[j] === "s00" || j === i) {
        j = Math.floor(Math.random() * 12);
    }
    [sectors[i], sectors[j]] = [sectors[j], sectors[i]];
    [rotations[i], rotations[j]] = [rotations[j], rotations[i]];
    swapSec(hexMap, i, j);
}

export function randomizeOne(hexMap, sectors, rotations, withSwap) {
    if (withSwap) {
        var i = Math.random() * 2;
        if (i < 1) {
            swapRandomSec(hexMap, sectors, rotations);
        } else {
            rotateRandomSec(hexMap, sectors, rotations);
        }
    } else {
        rotateRandomSec(hexMap, sectors, rotations);
    }
}

export function getRandomValidMap(hexMap, sectors, rotations, withSwap, criteria) {
    randomizeOne(hexMap, sectors, rotations, withSwap);
    var failures = 0;
    while (getMapValidity(hexMap, criteria) > 0) {
        failures++;
        if (failures > criteria.maxFail)
            return [false, failures];
        randomizeOne(hexMap, sectors, rotations, withSwap);
    }
    return [true, failures];
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