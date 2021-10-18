import React from 'react';
import './App.css';
import { MapView, HexMapView, HexInfoView } from './Map';
import Menu from './Menu';
import FixedMenu from './FixedMenu';
import Settings from './Settings';
import Evaluation from './Evaluation';
import { getSecOpt } from './Defs';
import { makeHexMap, makeInfoMap, getNeighbourMatrix, hasEqualNeighbour, getExpNbrStats, randomizeMap } from './Evaluator';


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
        this.onClickSector = this.onClickSector.bind(this);
    }

    componentDidMount() {
        this.evaluateMap(this.state.sectors, this.state.rotations);
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
                this.setState({ selected: -1, sectors: sec, rotations: rot });
            }
        }
        else {
            rot[i] = (rot[i] + 1) % 6;
            this.setState({ rotations: rot });
        }
        this.evaluateMap(sec,rot);
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
        this.setState({ numSect: numSec, sectors: getSecOpt(numSec, 0), secOpt: 0 });
        this.evaluateMap(getSecOpt(numSec, 0), this.state.rotations);
    }

    onClickOpt(variant) {
        this.setState({ secOpt: variant, sectors: getSecOpt(this.state.numSect, variant) });
        this.evaluateMap(getSecOpt(this.state.numSect, variant), this.state.rotations);
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
        randomizeMap(sec, rot, true);
        this.setState({ sectors: sec, rotations: rot });
        this.evaluateMap(sec, rot);
    }

    evaluateMap(sectors, rotations) {
        var hexMap = makeHexMap(sectors, rotations);
        makeInfoMap(hexMap);
        var nbrMat = getNeighbourMatrix(hexMap);
        var hasEqNbr = hasEqualNeighbour(nbrMat, 2);
        var balance = getExpNbrStats(nbrMat);
        this.setState({
            illegal: hasEqNbr,
            balanceStats: balance
        });
    }


    renderSettings() {
        if (this.state.showSettings) {
            return (
                <div className="menu-box">
                    <Menu
                        onClick={(numSec) => this.onClick(numSec)}
                        numSec={this.state.numSect}
                        onClickOpt={(variant) => this.onClickOpt(variant)}
                        secOpt={this.state.secOpt}
                        onClickRandom={() => this.onClickRandom()}
                    />
                    <Settings />
                </div>
            );
        }
        else {
            return;
        }
    }

    render() {
        return (
            <div className="App">
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
                />;
                <div className="fixed-menu-box">
                    <FixedMenu
                        onClickSwap={() => this.onClickSwap()}
                        onClickRot={() => this.onClickRot()}
                        swapMode={this.state.swapMode}
                        onClickShowSettings={() => this.onClickShowSettings()}
                        onClickDebug={() => this.onClickDebug()}
                        showSettings={this.state.showSettings}
                    />
                </div>
                {this.renderSettings()}
            </div>
        )
    }
}

export default App;
