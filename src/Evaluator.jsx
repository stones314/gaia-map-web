import React from 'react';
import './Menu.css';
import { getRingCoord } from './Defs';

const planets = ["Re", "Bl", "Wh", "Bk", "Br", "Ye", "Or", "Ga", "Tr"];
const colorWheel = ["Re", "Bl", "Wh", "Bk", "Br", "Ye", "Or"];
const expWgt = {
    "T0": 1.0,
    "T1": 0.8,
    "T2": 0.2,
    "T3": 0.0,
    "Ga": 1.0,
    "Tr": 0.2,
};
const leechWgt = {
    "T0": 0.0,
    "T1": 0.2,
    "T2": 0.6,
    "T3": 1.0,
    "Ga": 0.3,
    "Tr": 0.0,
};

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
            ringPlanets.push(hexMap[r][c]);
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
                "Em": 0,
                "Edges": 0.0,
            });
        }
    }

    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, planet] of hexes.entries()) {
            if (planet != "No" && planet != "Em") {
                for (var rad = 1; rad < 4; rad++) {
                    var ringPlanets = getRingPlanets(row, col, rad, hexMap);
                    for (const [i, neighbour] of ringPlanets.entries()) {
                        if (neighbour == "No") {
                            infoMap[row][col]["Edges"] += 1.0;
                        }
                        else if (neighbour == "Em") {
                            infoMap[row][col]["Em"] += 1.0;
                        }
                        else if (infoMap[row][col][neighbour] > rad) {
                            infoMap[row][col][neighbour] = rad;
                        }
                    }
                }
            }
        }
    }

    return infoMap;
}

export function evaluateMap(hexMap) {

    const nId = 0; //index of neighbour score
    const eEd = 1; //index of expansion score
    var scores = {};
    for (const [i, p] of colorWheel.entries())
        scores[p] = [0, 0];

    var info = makeInfoMap(hexMap);

    for (const [row, hexes] of hexMap.entries()) {
        for (const [col, planet] of hexes.entries()) {
            if (info[row][col]["Visited"])
                continue;
            if (planet === "No" || planet === "Em" || planet === "Ga") {
                info[row][col]["Visited"] = true;
                continue;
            }
            
        }
    }
}
