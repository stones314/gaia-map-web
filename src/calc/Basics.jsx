import { colorWheel, getSecOpt, sectorCenter } from './../Defs';
import { makeHexGrid } from './MapInformation';

export const NUM_ROWS = 17;
export const NUM_COLS = 22;
export const MAX_SLOT = 11;

export function isValidCoords(r, c) {
    if (r >= 0 && c >= 0 && r < NUM_ROWS && c < NUM_COLS)
        return true;
    return false;
}

export function getRandomSlot(sectors, ignore) {
    var i = Math.floor(Math.random() * MAX_SLOT);
    while (ignore.includes(sectors[i])) {
        i = Math.floor(Math.random() * MAX_SLOT);
    }
    return i;
}

export function dist(r1, c1, r2, c2) {
    return Math.max([
        Math.abs(r1 - r2),
        Math.abs(c1 - c2),
        Math.abs(-r1 - c1 - r2 + c2)]);
}

export function getRingCoords(row, col, radius) {
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

export function getSectorCoords(slot) {
    var [row, col] = sectorCenter[slot];
    return [[0, row, col],
        [1, row - 1, col],
        [1, row - 1, col + 1],
        [1, row, col + 1],
        [1, row + 1, col],
        [1, row + 1, col - 1],
        [1, row, col - 1],
        [2, row - 2, col],
        [2, row - 2, col + 1],
        [2, row - 2, col + 2],
        [2, row - 1, col + 2],
        [2, row, col + 2],
        [2, row + 1, col + 1],
        [2, row + 2, col],
        [2, row + 2, col - 1],
        [2, row + 2, col - 2],
        [2, row + 1, col - 2],
        [2, row, col - 2],
        [2, row - 1, col - 1]
    ];
}

export function colorDist(p1, p2) {
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


export function getRingPlanets(row, col, rad, hexGrid) {
    const ringCoords = getRingCoords(row, col, rad);
    //console.error("ring coords = " + ringCoords);
    var ringPlanets = [];
    for (const [i, [r, c]] of ringCoords.entries()) {
        if (r < 0 || c < 0 || r >= NUM_ROWS || c >= NUM_COLS) {
            ringPlanets.push("No");
        }
        else {
            ringPlanets.push(hexGrid[r][c]["Type"]);
        }
    }
    return ringPlanets;
}


export function isOutsideMap(hexType) {
    return (hexType === "No" || hexType === "Fr");
}


export function isPlanet(hexType) {
    return (hexType !== "No" && hexType !== "Fr" && hexType !== "Em")
}


export function isTerraformable(hexType) {
    return (isPlanet(hexType) && hexType !== "Tr" && hexType != "Ga")
}

export function getDynamicCoordMap() {
    var hexGrid = makeHexGrid(
        ["s05b", "s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "s10"],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    var dynamicCoordMap = [];
    for (const [row, hexes] of hexGrid.entries()) {
        dynamicCoordMap.push([]);
        for (const [col, hex] of hexes.entries()) {
            dynamicCoordMap[row].push([]);
            for (var rad = 1; rad < 4; rad++) {
                var ringCoords = getRingCoords(row, col, rad);
                for (const [ringId, [r, c]] of ringCoords.entries()) {
                    if (r >= 0 && c >= 0 && r < NUM_ROWS && c < NUM_COLS) {
                        if (hexGrid[r][c]["Sec"] !== hex["Sec"]) {
                            dynamicCoordMap[row][col].push([rad, r, c]);
                        }
                    }
                }
            }
        }
    }
    return dynamicCoordMap;
}

