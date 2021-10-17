import React from 'react';
import './Menu.css';
import { getRingCoord, sectorCenter } from './Defs';

export const hexTypes = ["Re", "Bl", "Wh", "Bk", "Br", "Ye", "Or", "Ga", "Tr", "Em", "No"];
export const planets = ["Re", "Bl", "Wh", "Bk", "Br", "Ye", "Or", "Ga", "Tr"];
export const colorWheel = ["Re", "Bl", "Wh", "Bk", "Br", "Ye", "Or"];

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

export function makeInfoMap(hexMap) {
    var infoMap = [];
    for (var i = 0; i < 17; i++) {
        infoMap.push([]);
        for (var j = 0; j < 24; j++) {
            infoMap[i].push({
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
                "Row": 0,
                "Col": 0,
                "Type": "No",
                "Sec": "s00", 
            });
        }
    }

    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, planet] of hexes.entries()) {
            infoMap[row][col]["Row"] = row;
            infoMap[row][col]["Col"] = col;
            infoMap[row][col]["Type"] = planet["Type"];
            infoMap[row][col]["Sec"] = hexMap[row][col]["Sec"];
            if (planet["Type"] != "No" && planet["Type"] != "Em") {
                for (var rad = 1; rad < 4; rad++) {
                    var ringPlanets = getRingPlanets(row, col, rad, hexMap);
                    for (const [i, neighbour] of ringPlanets.entries()) {
                        if (neighbour == "No" || neighbour === "Em") {
                            infoMap[row][col][neighbour][rad - 1]++;
                        }
                        else if (infoMap[row][col][neighbour] > rad){
                            infoMap[row][col][neighbour] = rad;
                        }
                    }
                }
            }
        }
    }

    return infoMap;
}

export function getNeighbourMatrix(infoMap, hexMap) {
    var nbrMat = {};
    for (const [i, planet] of planets.entries()) {
        nbrMat[planet] = {};
        for (const [j, neighbour] of hexTypes.entries()) {
            nbrMat[planet][neighbour] = [0, 0, 0];
        }
    }

    for (const [row, hexes] of infoMap.entries()) {
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
