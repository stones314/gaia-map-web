import { getMapValidity, evaluateMap, evaluate } from './MapEvaluation.jsx';
import { sectorCenter } from '../Defs.jsx';
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
    var i = Math.floor(Math.random() * 12);
    while (sectors[i] === "s00") {
        i = Math.floor(Math.random() * 12);
    }
    rotations[i] = (rotations[i] + 1) % 6;
    rotateSec(hexGrid, i);
}

function swapRandomSec(hexGrid, sectors, rotations) {
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