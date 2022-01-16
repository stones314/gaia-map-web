import { getSecOpt, colorWheel, metrics, sectorFromLetter, sectorToLetter} from './../Defs';
import {
    makeHexGrid,
    getNeighbourMatrix,
    setStaticNeighbourInfo,
    getClusterData,
    updateNeighbourInfo,
    updateNeighbourMatrix,
} from './MapInformation';
import { rotateSec, swapSec, convertMapString } from './MapManipulation';
import { hasEqualNeighbour, getHighestEdgeCount, evaluatePlanetHappiness } from './MapEvaluation';
import { getRandomSlot, getDynamicCoordMap } from './Basics';

class PlanetHappiness {
    constructor(planetType) {
        this.planet = planetType;
        this.score = {
            "Exp": 0.0,
            "Leech": 0.0,
            "EdgSad": 0.0,
            "Happy": 0.0,
        }
    }

    update() {
        this.score["Happy"] = this.score["Exp"] + this.score["Leech"] - this.score["EdgSad"];
    }
}

export class MapHappiness {
    constructor() {
        this.colorHappy = {
            "Re": new PlanetHappiness("Re"),
            "Bl": new PlanetHappiness("Bl"),
            "Wh": new PlanetHappiness("Wh"),
            "Bk": new PlanetHappiness("Bk"),
            "Br": new PlanetHappiness("Br"),
            "Ye": new PlanetHappiness("Ye"),
            "Or": new PlanetHappiness("Or"),
            "Max": new PlanetHappiness("Max"),
        }
    }

    update() {
        for (const [j, p] of colorWheel.entries()) {
            this.colorHappy[p].update();
        }

        for (const [i, m] of metrics.entries()) {
            this.colorHappy["Max"].score[m] = 0.0;
            for (const [j, p] of colorWheel.entries()) {
                if (this.colorHappy[p].score[m] > this.colorHappy["Max"].score[m])
                    this.colorHappy["Max"].score[m] = this.colorHappy[p].score[m];
            }
        }
    }

    getValues(metric) {
        var myOut = {
            planets: [],
            values: [],
            max: 0.0
        }
        for (const [j, p] of colorWheel.entries()) {
            myOut.planets.push(p);
            myOut.values.push(this.colorHappy[p].score[metric]);
            myOut.max = this.colorHappy["Max"].score["Happy"];
        }
        return myOut;
    }
}


export class HexMap {
    constructor() {
        this.sectors = getSecOpt(10, 0);
        this.rotations = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.dynCoordMap = getDynamicCoordMap();
        this.hexGrid = makeHexGrid(this.sectors, this.rotations);
        setStaticNeighbourInfo(this.hexGrid);
        updateNeighbourInfo(this.hexGrid, this.dynCoordMap);
        this.nbrMat = getNeighbourMatrix(this.hexGrid);
        this.criteria = {
            minEqDist: 2,
            maxClusterSize: 5,
            maxEdgeCount: 2,
            maxFailures: 100000,
            ignoreNum: 0,
        }
        this.biggestCluster = getClusterData(this.hexGrid);
        this.highestEdgeCount = getHighestEdgeCount(this.nbrMat, this.criteria.maxEdgeCount);
        this.rngWithSwap = true;
        this.happiness = new MapHappiness();
    }

    setFromString(mapString) {
        var out = convertMapString(mapString);
        if (!out.valid)
            return out;
        this.setMap(out.sectors, out.rotations);
        return out;
    }

    getMapString() {
        var mapString = "";
        for (const [i, s] of this.sectors.entries()) {
            if(i < 11)
                mapString += sectorToLetter[s] + this.rotations[i];
        }
        var i = this.sectors.length;
        while (i < 11) {
            mapString += "A0";
        }
        return mapString;
    }

    setMap(sectors, rotations) {
        this.sectors = sectors;
        this.rotations = rotations;
        this.hexGrid = makeHexGrid(this.sectors, this.rotations);
        setStaticNeighbourInfo(this.hexGrid);
        this.nbrMat = getNeighbourMatrix(this.hexGrid);
        this.updateMapData();
    }

    newSectorSelection(numSec, variant) {
        if     (numSec === 10 && variant === 0) this.setFromString("A0N0B0F0M0C0D0H0L0E0J0");
        else if (numSec === 9 && variant === 0) this.setFromString("C2B4N0A0E5D4M2A0I4G3K0");
        else if (numSec === 9 && variant === 1) this.setFromString("M3D1H2A0C2G3B0A0J5N1L0");
        else if (numSec === 8 && variant === 0) this.setFromString("A0A0B0F0A0C0D0H0L0E0J0");
        else if (numSec === 7 && variant === 0) this.setFromString("A0B0G0A0C0D0I0A0E0K0A0");
        else if (numSec === 7 && variant === 1) this.setFromString("A0H4B5A0G5C3L2A0J3D2A0");
        else if (numSec === 7 && variant === 2) this.setFromString("A0C2N1A0F5E5L4A0H1K4A0");
        else if (numSec === 7 && variant === 3) this.setFromString("A0J5D0A0F5M1B5A0I2E0A0");
        else if (numSec === 7 && variant === 4) this.setFromString("A0D4M3A0F5E5N0A0K3B1A0");
    }

    updateMapData() {
        updateNeighbourInfo(this.hexGrid, this.dynCoordMap);
        updateNeighbourMatrix(this.hexGrid, this.nbrMat);
        this.biggestCluster = getClusterData(this.hexGrid);
        this.highestEdgeCount = getHighestEdgeCount(this.nbrMat, this.criteria.maxEdgeCount);
        evaluatePlanetHappiness(this.hexGrid, this.happiness);
    }

    rotateSec(slot) {
        rotateSec(this.hexGrid, slot);
        this.rotations[slot] = (this.rotations[slot] + 1) % 6;
    }

    swapSec(slotA, slotB) {
        swapSec(this.hexGrid, slotA, slotB);
        [this.sectors[slotA], this.sectors[slotB]]
            = [this.sectors[slotB], this.sectors[slotA]];
        [this.rotations[slotA], this.rotations[slotB]]
            = [this.rotations[slotB], this.rotations[slotA]];
    }

    rotateRandomSec() {
        var slot = getRandomSlot(this.sectors, ["s00"]);
        this.rotateSec(slot);
    }

    swapRandomSec() {
        var slotA = getRandomSlot(this.sectors, ["s00"]);
        var slotB = getRandomSlot(this.sectors, ["s00", this.sectors[slotA]]);
        this.swapSec(slotA, slotB);
    }

    randomizeOnce() {
        if (this.rngWithSwap) {
            var i = Math.random() * 2;
            if (i < 1) {
                this.swapRandomSec();
            } else {
                this.rotateRandomSec();
            }
        } else {
            this.rotateRandomSec();
        }
    }

    randomizeMany(times) {
        for (var i = 0; i < times; i++) {
            this.randomizeOnce();
        }
    }

    getRandomValidMap() {
        this.randomizeMany(10);

        var failures = 1;
        while (this.getMapValidity() > 0) {
            failures++;
            if (failures > this.criteria.maxFailures)
                return [false, failures];
            this.randomizeMany(10);
        }
        return [true, failures];
    }

    getMinEqDist() {
        for (var r = 1; r < 4; r++)
            if (hasEqualNeighbour(this.nbrMat, r))
                return r-1;
        return 3;
    }

    getMapValidity() {
        /*
         * Return values:
         * 0 - map is valid
         * 1 - failed on minimum equal dist
         * 2 - failed on maximum cluster size
         * 3 - failed on max edge count
         * N - failed on
         */
        this.updateMapData();
        if (hasEqualNeighbour(this.nbrMat, this.criteria.minEqDist))
            return 1;
        else if (this.biggestCluster > this.criteria.maxClusterSize)
            return 2;
        else if (this.criteria.maxEdgeCount < this.highestEdgeCount[1])
            return 3;
        return 0;
    }

    getHappyValues(metric) {
        return this.happiness.getValues(metric);
    }
}
