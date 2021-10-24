import { planets, colorWheel } from './../Defs';
import { makeHexGrid, updateNeighbourInfo, getNeighbourMatrix, getExpNbrStats } from './MapInformation';

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

export function evaluatePlanetHappiness(hexGrid) {

    for (const [row, hexes] of hexGrid.entries()) {
        for (const [col, hex] of hexes.entries()) {

        }
    }
    return hexGrid;
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


