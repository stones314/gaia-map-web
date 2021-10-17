import './App.css';

export const images = {
    "Re": "https://rygg-gaard.no/gaia/img/RedHex.png",
    "Bl": "https://rygg-gaard.no/gaia/img/BlueHex.png",
    "Wh": "https://rygg-gaard.no/gaia/img/WhiteHex.png",
    "Bk": "https://rygg-gaard.no/gaia/img/BlackHex.png",
    "Br": "https://rygg-gaard.no/gaia/img/BrownHex.png",
    "Ye": "https://rygg-gaard.no/gaia/img/YellowHex.png",
    "Or": "https://rygg-gaard.no/gaia/img/OrangeHex.png",
    "Ga": "https://rygg-gaard.no/gaia/img/GaiaHex.png",
    "Tr": "https://rygg-gaard.no/gaia/img/TransdimHex.png",
    "Em": "https://rygg-gaard.no/gaia/img/EmptyHex.png",
    "s00": "https://rygg-gaard.no/gaia/img/s00.png",
    "s01": "https://rygg-gaard.no/gaia/img/s01.png",
    "s02": "https://rygg-gaard.no/gaia/img/s02.png",
    "s03": "https://rygg-gaard.no/gaia/img/s03.png",
    "s04": "https://rygg-gaard.no/gaia/img/s04.png",
    "s05": "https://rygg-gaard.no/gaia/img/s05.png",
    "s05b": "https://rygg-gaard.no/gaia/img/s05b.png",
    "s06": "https://rygg-gaard.no/gaia/img/s06.png",
    "s06b": "https://rygg-gaard.no/gaia/img/s06b.png",
    "s07": "https://rygg-gaard.no/gaia/img/s07.png",
    "s07b": "https://rygg-gaard.no/gaia/img/s07b.png",
    "s08": "https://rygg-gaard.no/gaia/img/s08.png",
    "s09": "https://rygg-gaard.no/gaia/img/s09.png",
    "s10": "https://rygg-gaard.no/gaia/img/s10.png",
    "c01": "https://rygg-gaard.no/gaia/img/CenterHex01.png",
    "c02": "https://rygg-gaard.no/gaia/img/CenterHex02.png",
    "c03": "https://rygg-gaard.no/gaia/img/CenterHex03.png",
    "c04": "https://rygg-gaard.no/gaia/img/CenterHex04.png",
    "c05": "https://rygg-gaard.no/gaia/img/CenterHex05.png",
    "c05b": "https://rygg-gaard.no/gaia/img/CenterHex05b.png",
    "c06": "https://rygg-gaard.no/gaia/img/CenterHex06.png",
    "c06b": "https://rygg-gaard.no/gaia/img/CenterHex06b.png",
    "c07": "https://rygg-gaard.no/gaia/img/CenterHex07.png",
    "c07b": "https://rygg-gaard.no/gaia/img/CenterHex07b.png",
    "c08": "https://rygg-gaard.no/gaia/img/CenterHex08.png",
    "c09": "https://rygg-gaard.no/gaia/img/CenterHex09.png",
    "c10": "https://rygg-gaard.no/gaia/img/CenterHex10.png",
    "Rot": "https://rygg-gaard.no/gaia/img/RotateSec.png",
};

export const sectorCenter = [
    [8, 2], [6, 7], [4, 12], [2, 17],
    [11, 4], [9, 9], [7, 14], [5, 19],
    [14, 6], [12, 11], [10, 16], [8, 21]
];

export function getSectorArray(id) {
    if (id === "s01") {
        return [
            ["Em"],
            ["Em", "Bl", "Em", "Em", "Em", "Br"],
            ["Em", "Em", "Em", "Tr", "Em", "Or", "Re", "Em", "Em", "Ye", "Em", "Em"]];
    }
    if (id === "s02") {
        return [
            ["Em"],
            ["Em", "Wh", "Em", "Em", "Br", "Em"],
            ["Bk", "Em", "Em", "Ye", "Em", "Tr", "Em", "Re", "Em", "Em", "Em", "Or"]];
    }
    if (id === "s03") {
        return [
            ["Em"],
            ["Em", "Em", "Wh", "Em", "Em", "Ga"],
            ["Tr", "Em", "Em", "Bk", "Em", "Em", "Ye", "Bl", "Em", "Em", "Em", "Em"]];
    }
    if (id === "s04") {
        return [
            ["Em"],
            ["Re", "Em", "Br", "Em", "Or", "Em"],
            ["Bk", "Em", "Em", "Em", "Bl", "Em", "Em", "Em", "Em", "Wh", "Em", "Em"]];
    }
    if (id === "s05") {
        return [
            ["Em"],
            ["Em", "Em", "Em", "Em", "Em", "Ga"],
            ["Wh", "Em", "Tr", "Re", "Em", "Em", "Ye", "Or", "Em", "Em", "Em", "Em"]];
    }
    if (id === "s06") {
        return [
            ["Em"],
            ["Em", "Bl", "Em", "Ga", "Em", "Br"],
            ["Em", "Tr", "Em", "Em", "Ye", "Tr", "Em", "Em", "Em", "Em", "Em", "Em"]];
    }
    if (id === "s07") {
        return [
            ["Em"],
            ["Re", "Em", "Ga", "Em", "Ga", "Em"],
            ["Em", "Br", "Em", "Em", "Em", "Em", "Bk", "Em", "Em", "Em", "Tr", "Em"]];
    }
    if (id === "s08") {
        return [
            ["Em"],
            ["Wh", "Em", "Bk", "Em", "Or", "Em"],
            ["Bl", "Em", "Tr", "Em", "Em", "Em", "Em", "Tr", "Em", "Em", "Em", "Em"]];
    }
    if (id === "s09") {
        return [
            ["Em"],
            ["Em", "Em", "Ga", "Em", "Bk", "Em"],
            ["Em", "Tr", "Wh", "Em", "Em", "Em", "Em", "Em", "Br", "Em", "Em", "Or"]];
    }
    if (id === "s10") {
        return [
            ["Em"],
            ["Em", "Em", "Ga", "Em", "Em", "Ye"],
            ["Em", "Tr", "Tr", "Em", "Em", "Em", "Em", "Re", "Bl", "Em", "Em", "Em"]];
    }
    if (id === "s05b") {
        return [
            ["Em"],
            ["Em", "Em", "Em", "Em", "Em", "Ga"],
            ["Wh", "Em", "Tr", "Re", "Em", "Em", "Em", "Or", "Em", "Em", "Em", "Em"]];
    }
    if (id === "s06b") {
        return [
            ["Em"],
            ["Em", "Bl", "Em", "Ga", "Em", "Em"],
            ["Em", "Tr", "Em", "Em", "Ye", "Tr", "Em", "Em", "Em", "Em", "Em", "Em"]];
    }
    if (id === "s07b") {
        return [
            ["Em"],
            ["Ga", "Em", "Br", "Em", "Ga", "Em"],
            ["Em", "Em", "Em", "Em", "Em", "Em", "Bk", "Em", "Em", "Em", "Tr", "Em"]];
    }
    return [
        ["No"],
        ["No", "No", "No", "No", "No", "No"],
        ["No", "No", "No", "No", "No", "No", "No", "No", "No", "No", "No", "No"]];
}

export function getSecOpt(numSec, optNum) {
    if (numSec === 7) {
        var opt = optNum;
        if (opt < 0 || opt > 4)
            opt = Math.floor(5.0 * Math.random());
        if (opt === 0)
            return [
               "s00", "s01", "s02", "s00",
               "s03", "s04", "s05b", "s00",
               "s06b", "s07b", "s00", "s00"
            ];
        if (opt === 1)
            return [
               "s00", "s01", "s02", "s00",
               "s03", "s05b", "s06", "s00",
               "s07", "s08", "s00", "s00"
            ];
        if (opt === 2)
            return [
               "s00", "s02", "s04", "s00",
               "s05", "s06", "s07b", "s00",
               "s08", "s10", "s00", "s00"
            ];
        if (opt === 3)
            return [
               "s00", "s01", "s03", "s00",
               "s04", "s05", "s06b", "s00",
               "s07", "s09", "s00", "s00"
            ];
        if (opt === 4)
            return [
               "s00", "s01", "s03", "s00",
               "s04", "s05", "s07b", "s00",
               "s09", "s10", "s00", "s00"
            ];
    }
    if (numSec === 8) {
        return [
           "s00", "s01", "s02", "s03",
           "s00", "s04", "s05", "s00",
           "s06", "s07", "s08", "s00"
        ];
    }
    if (numSec === 9) {
        opt = optNum;
        if (opt < 0 || opt > 1)
            opt = Math.floor(2.0 * Math.random());
        if (opt === 0)
            return [
               "s00", "s01", "s02", "s03",
               "s00", "s04", "s05b", "s06b",
               "s00", "s07b", "s09", "s10"
            ];
        if (opt === 1)
            return [
               "s00", "s01", "s02", "s03",
               "s00", "s05b", "s06", "s07",
               "s00", "s08", "s09", "s10"
            ];
    }
    return [
       "s00", "s01", "s02", "s03",
       "s04", "s05", "s06", "s07",
       "s08", "s09", "s10", "s00"
    ];
}

export class Coord {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

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
            [row - 1, col    ],
            [row - 1, col + 1],
            [row    , col + 1],
            [row + 1, col    ],
            [row + 1, col - 1],
            [row    , col - 1]];
    }
    if (radius === 2) {
        return [
            [row - 2, col    ],
            [row - 2, col + 1],
            [row - 2, col + 2],
            [row - 1, col + 2],
            [row    , col + 2],
            [row + 1, col + 1],
            [row + 2, col    ],
            [row + 2, col - 1],
            [row + 2, col - 2],
            [row + 1, col - 2],
            [row    , col - 2],
            [row - 1, col - 1]];
    }
    if (radius === 3) {
        return [
            [row - 3, col    ],
            [row - 3, col + 1],
            [row - 3, col + 2],
            [row - 3, col + 3],
            [row - 2, col + 3],
            [row - 1, col + 3],
            [row    , col + 3],
            [row + 1, col + 2],
            [row + 2, col + 1],
            [row + 3, col    ],
            [row + 3, col - 1],
            [row + 3, col - 2],
            [row + 3, col - 3],
            [row + 2, col - 3],
            [row + 1, col - 3],
            [row    , col - 3],
            [row - 1, col - 2],
            [row - 2, col - 1]];
    }
    return []
}

export function makeHexMap(sectors, rotations) {
    var hexMap = [];
    for (var i = 0; i < 17; i++) {
        hexMap.push([]);
        for (var j = 0; j < 24; j++) {
            hexMap[i].push({
                "Type": "No",
                "Sec": "s00",
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
        for (rad = 1; rad < 3; rad++) {
            var ringCoords = getRingCoord(row, col, rad);
            var ringPlanets = rotate(hexes[rad], rad, rotations[index]);
            for (const [ringId, [r, c]] of ringCoords.entries()) {
                hexMap[r][c]["Type"] = ringPlanets[ringId];
                hexMap[r][c]["Sec"] = sector;
            }
        }
    }

    return hexMap;
}