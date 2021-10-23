import {
    isPlanet,
    getRingCoords,
    isTerraformable,
    colorDist,
    getRingPlanets,
    isOutsideMap,
    getDynamicCoordMap
} from './Basics';
import {
    getSectorArray,
    sectorCenter,
    planets,
    colorWheel,
    hexTypes,
    dynamicCoordMap
} from './../Defs';
import { rotate } from './MapManipulation';

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
                "sRe": [0, 0, 0],
                "sBl": [0, 0, 0],
                "sWh": [0, 0, 0],
                "sBk": [0, 0, 0],
                "sBr": [0, 0, 0],
                "sYe": [0, 0, 0],
                "sOr": [0, 0, 0],
                "sGa": [0, 0, 0],
                "sTr": [0, 0, 0],
                "sEm": [0, 0, 0],
                "sNo": [0, 0, 0],
                "sT0": [0, 0, 0],
                "sT1": [0, 0, 0],
                "sT2": [0, 0, 0],
                "sT3": [0, 0, 0],
                "sNbr": [0, 0, 0],
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
            var ringCoords = getRingCoords(row, col, rad);
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


export function setStaticNeighbourInfo(hexMap) {
    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, hex] of hexes.entries()) {
            if (isPlanet(hex["Type"])) {
                for (var rad = 1; rad < 4; rad++) {
                    var ringCoords = getRingCoords(row, col, rad);
                    for (const [ringId, [r, c]] of ringCoords.entries()) {
                        if (r >= 0 && c >= 0 && r <= 16 && c <= 23) {
                            var nbr = hexMap[r][c];
                            if (nbr["Sec"] === hex["Sec"]) {
                                hex["s" + nbr["Type"]][rad - 1]++;
                                if (isTerraformable(hex["Type"]) && isTerraformable(nbr["Type"])) {
                                    var terraCost = "sT" + colorDist(hex["Type"], nbr["Type"]);
                                    hex[terraCost][rad - 1]++;
                                }
                                if (nbr["Type"] !== "Em")
                                    hex["sNbr"][rad - 1]++;
                            }
                        }
                    }
                }
            }
        }
    }
}

export function updateNeighbourInfo(hexMap) {

    const dynCoordMap = getDynamicCoordMap();

    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, hex] of hexes.entries()) {
            if (!isOutsideMap(hex["Type"])) {
                hex["Row"] = row;
                hex["Col"] = col;
            }
            if (isPlanet(hex["Type"])) {
                for (const [hi, ht] of hexTypes.entries()) {
                    hex[ht] = hex["s" + ht].slice();;//reset values to the static data
                }
                for (var i = 0; i < 4; i++) {
                    hex["T" + i] = hex["sT" + i].slice();;
                }
                hex["Nbr"] = hex["sNbr"].slice();
                for (const [di, [rad, r, c]] of dynCoordMap[row][col].entries()) {
                    var nbr = hexMap[r][c]["Type"];
                    if (isOutsideMap(nbr)) {
                        hex["No"][rad - 1]++;
                    }
                    else {
                        hex[nbr][rad - 1]++;
                        if (nbr != "Em")
                            hex["Nbr"][rad - 1]++;
                    }
                    if (isTerraformable(hex["Type"]) && isTerraformable(nbr)) {
                        var terraCost = "T" + colorDist(hex["Type"], nbr);
                        hex[terraCost][rad - 1]++;
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

export function updateNeighbourMatrix(hexMap, nbrMat) {
    for (const [i, planet] of planets.entries()) {
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
