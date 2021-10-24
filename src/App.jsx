import React from 'react';
import './styles/App.css';
import { MapView } from './Map';
import Menu from './Menu';
import FixedMenu from './FixedMenu';
import { getSecOpt } from './Defs';
import {
    hasEqualNeighbour,
} from './calc/MapEvaluation';
import {
    getNeighbourMatrix,
    makeHexMap,
    getExpNbrStats,
    setStaticNeighbourInfo,
    updateNeighbourInfo,
} from "./calc/MapInformation";
import { getRandomValidMap, rotateSec, swapSec, randomizeOnce, optimize} from './calc/MapManipulation';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectors: getSecOpt(10, 0),
            rotations: [0,0,0,0,0,0,0,0,0,0,0,0],
            selected: -1,
            swapMode: true,
            numSect: 10,
            secOpt: 0,
            showSettings: false,
            showDebug: false,
            illegal: false,
            rngWithSwap: true,
            minEqDist: 2,
            hexInfo: {
                "Visited": false,
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
                "No": 0.0,
                "Row": 0,
                "Col": 0,
                "Type": "No",
            },
            balanceStats: {
                "Re": [0.0, 0.0],
                "Bl": [0.0, 0.0],
                "Wh": [0.0, 0.0],
                "Bk": [0.0, 0.0],
                "Br": [0.0, 0.0],
                "Ye": [0.0, 0.0],
                "Or": [0.0, 0.0],
            }
        };
        this.hexMap = makeHexMap(getSecOpt(10, 0), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setStaticNeighbourInfo(this.hexMap);
        updateNeighbourInfo(this.hexMap);
        this.nbrMat = getNeighbourMatrix(this.hexMap);
        this.onClickSector = this.onClickSector.bind(this);
    }

    componentDidMount() {
        this.onClickRandom();
    }

    onClickSector(i) {
        var rot = this.state.rotations.slice();
        var sec = this.state.sectors.slice();
        if (this.state.swapMode) {
            if (this.state.selected < 0) {
                this.setState({ selected: i});
            } else if (this.state.selected === i) {
                this.setState({ selected: -1 });
            } else {
                [sec[i], sec[this.state.selected]] = [sec[this.state.selected], sec[i]];
                [rot[i], rot[this.state.selected]] = [rot[this.state.selected], rot[i]];
                swapSec(this.hexMap, this.nbrMat, i, this.state.selected);
                this.setState({ selected: -1, sectors: sec, rotations: rot });
            }
        }
        else {
            rot[i] = (rot[i] + 1) % 6;
            this.setState({ rotations: rot });
            rotateSec(this.hexMap, this.nbrMat, i);
        }
        this.evaluateMap();
    }

    onClickHex(hexInfo) {
        this.setState({ hexInfo: hexInfo });
    }

    onClickSwap() {
        if (!this.state.swapMode)
            this.setState({ swapMode: true });
    }

    onClickRot() {
        if (this.state.swapMode)
            this.setState({ swapMode: false });
    }

    onClick(numSec) {
        this.setState({
            numSect: numSec,
            sectors: getSecOpt(numSec, 0),
            secOpt: 0,
            rotations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });
        this.hexMap = makeHexMap(getSecOpt(numSec, 0), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setStaticNeighbourInfo(this.hexMap);
        updateNeighbourInfo(this.hexMap);
        this.nbrMat = getNeighbourMatrix(this.hexMap);

        this.evaluateMap();
    }

    onClickOpt(variant) {
        this.setState({
            secOpt: variant,
            sectors: getSecOpt(this.state.numSect, variant),
            rotations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
        this.hexMap = makeHexMap(getSecOpt(this.state.numSect, variant), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setStaticNeighbourInfo(this.hexMap);
        updateNeighbourInfo(this.hexMap);
        this.nbrMat = getNeighbourMatrix(this.hexMap);
        this.evaluateMap();
    }

    onClickRngSwap(doSwap) {
        this.setState({ rngWithSwap: doSwap == "Yes" });
    }

    onClickMinEqualDist(minEqDist) {
        this.setState({ minEqDist: minEqDist });
        var criteria = {
            minEqDist: minEqDist,
            maxFailures: 10000,
        }
        this.evaluateMapWC(criteria);
    }

    onClickShowSettings() {
        this.setState({ showSettings: !this.state.showSettings });
    }

    onClickDebug() {
        this.setState({ showDebug: !this.state.showDebug });
    }

    onClickRandom() {
        var sec = this.state.sectors.slice();
        var rot = this.state.rotations.slice();
        var criteria = {
            minEqDist: this.state.minEqDist,
            maxFailures: 2000,
        }
//        randomizeOne(this.hexMap, sec, rot, this.state.rngWithSwap);
        var [ok, failures] = getRandomValidMap(this.hexMap, this.nbrMat, sec, rot, this.state.rngWithSwap, criteria);
        if (true) {
            this.setState({ sectors: sec, rotations: rot });
            this.evaluateMap();
        }
        //console.error("Used " + failures + " tries!");
    }

    onClickBalance() {
        var sec = this.state.sectors.slice();
        var rot = this.state.rotations.slice();
        var criteria = {
            minEqDist: this.state.minEqDist,
            maxFailures: 2000,
        }
        //        randomizeOne(this.hexMap, sec, rot, this.state.rngWithSwap);
        var bs = optimize(this.hexMap, this.nbrMat, sec, rot, this.state.rngWithSwap, criteria);

        this.setState({ sectors: sec, rotations: rot });
        this.evaluateMap();

        //console.error("Used " + failures + " tries!");
    }

    evaluateMapWC(criteria) {
        var hasEqNbr = hasEqualNeighbour(this.nbrMat, criteria.minEqDist);
        var balance = getExpNbrStats(this.nbrMat);
        this.setState({
            illegal: hasEqNbr,
            balanceStats: balance
        });
    }

    evaluateMap() {
        var criteria = {
            minEqDist: this.state.minEqDist,
            maxFailures: 2000,
        }
        this.evaluateMapWC(criteria);
    }

    renderSettings() {
        if (this.state.showSettings) {
            return (
                <Menu
                    onClick={(numSec) => this.onClick(numSec)}
                    numSec={this.state.numSect}
                    onClickOpt={(variant) => this.onClickOpt(variant)}
                    secOpt={this.state.secOpt}
                    minEqDist={this.state.minEqDist}
                    onClickMinEqualDist={(minEqDist) => this.onClickMinEqualDist(minEqDist)}
                    onClickRandom={() => this.onClickRandom()}
                    rngWithSwap={this.state.rngWithSwap}
                    onClickRngSwap={(doSwap) => this.onClickRngSwap(doSwap)}
                    onClickBalance={() => this.onClickBalance()}
                />
            );
        }
        else {
            return;
        }
    }

    render() {
        var illegalClass = this.state.illegal ? " illegal" : " legal";
        return (
            <div className={"App" + illegalClass}>
                <FixedMenu
                    onClickSwap={() => this.onClickSwap()}
                    onClickRot={() => this.onClickRot()}
                    swapMode={this.state.swapMode}
                    onClickShowSettings={() => this.onClickShowSettings()}
                    onClickDebug={() => this.onClickDebug()}
                    showSettings={this.state.showSettings}
                    showDebug={this.state.showDebug}
                />
                {this.renderSettings()}
                <MapView
                    numSect={this.state.numSect}
                    sectors={this.state.sectors}
                    rotations={this.state.rotations}
                    onClick={(i) => this.onClickSector(i)}
                    selected={this.state.selected}
                    illegal={this.state.illegal}
                    showDebug={this.state.showDebug}
                    onClickHex={(hexInfo) => this.onClickHex(hexInfo)}
                    balanceStats={this.state.balanceStats}
                    hexInfo={this.state.hexInfo}
                    minEqDist={this.state.minEqDist}
                    hexMap={this.hexMap}
                />
            </div>
        )
    }
}

export default App;
