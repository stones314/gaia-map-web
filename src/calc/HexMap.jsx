import { getSecOpt, } from './../Defs';
import {
    makeHexGrid,
    getNeighbourMatrix,
    setStaticNeighbourInfo,
    getClusterData,
    updateNeighbourInfo,
    updateNeighbourMatrix,
} from './MapInformation';
import { rotateSec, swapSec } from './MapManipulation';
import { hasEqualNeighbour, getHighestEdgeCount } from './MapEvaluation';
import { getRandomSlot } from './Basics';

export class HexMap {
    constructor() {
        this.sectors = getSecOpt(10, 0);
        this.rotations = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.hexGrid = makeHexGrid(this.sectors, this.rotations);
        setStaticNeighbourInfo(this.hexGrid);
        updateNeighbourInfo(this.hexGrid);
        this.nbrMat = getNeighbourMatrix(this.hexGrid);
        this.biggestCluster = getClusterData(this.hexGrid);
        this.criteria = {
            minEqDist: 2,
            maxClusterSize: 5,
            maxEdgeCount: 2,
            maxFailures: 10000,
        }
    }

    newSectorSelection(numSec, variant) {
        this.sectors = getSecOpt(numSec, variant);
        this.rotations = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.hexGrid = makeHexGrid(this.sectors, this.rotations);
        setStaticNeighbourInfo(this.hexGrid);
        this.updateMapData();
    }

    updateMapData() {
        updateNeighbourInfo(this.hexGrid);
        updateNeighbourMatrix(this.hexGrid, this.nbrMat);
        this.biggestCluster = getClusterData(this.hexGrid);
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

    randomizeOnce(withSwap) {
        if (withSwap) {
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

    randomizeMany(withSwap, times) {
        for (var i = 0; i < times; i++) {
            this.randomizeOnce(withSwap);
        }
    }

    getRandomValidMap(withSwap) {
        this.randomizeMany(withSwap, 10);

        var failures = 1;
        while (this.getMapValidity() > 0) {
            failures++;
            if (failures > this.criteria.maxFail)
                return [false, failures];
            this.randomizeMany(withSwap, 10);
        }
        return [true, failures];
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
        else if (this.criteria.maxEdgeCount < getHighestEdgeCount(this.nbrMat))
            return 3;
        return 0;
    }
}
