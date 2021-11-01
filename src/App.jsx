import React from 'react';
import './styles/App.css';
import { MapView } from './Map';
import Menu from './Menu';
import FixedMenu from './FixedMenu';
import ColorHappyView from './ColorHappyView';
import { HexMap } from './calc/HexMap';
import { settingOpts } from './Defs';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: -1,
            swapMode: true,
            numSect: 10,
            secOpt: 0,
            showSettings: false,
            showDebug: false,
            illegal: false,
            menuSelect: {
                minEqDist: settingOpts.minEqDist.defaultId,
                maxCluster: settingOpts.maxClustSize.defaultId,
                maxEdge: settingOpts.maxEdgeCount.defaultId,
                rngWithSwap: settingOpts.rngWithSwap.defaultId,
                ignoreOpt: settingOpts.ignoreNum.defaultId,
            },
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
        this.hexMap = new HexMap();
    }

    componentDidMount() {
        this.onClickRandom();
    }

    onClickSector(slot) {
        if (this.state.swapMode) {
            if (this.state.selected < 0) {
                this.setState({ selected: slot});
            } else if (this.state.selected === slot) {
                this.setState({ selected: -1 });
            } else {
                this.hexMap.swapSec(slot, this.state.selected);
                this.setState({ selected: -1});
            }
        }
        else {
            this.hexMap.rotateSec(slot);
        }
        this.evaluateMap();
    }

    onClickHex(hexInfo) {
        if (!this.state.showDebug) {
            this.onClickSector(hexInfo["Slot"]);
        }
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
            secOpt: 0,
        });
        this.hexMap.newSectorSelection(numSec, 0);
        this.evaluateMap();
    }

    onClickOpt(variant) {
        this.setState({
            secOpt: variant,
        });
        this.hexMap.newSectorSelection(this.state.numSect, variant);
        this.evaluateMap();
    }

    onClickRngSwap(rngSwapOpt) {
        var ms = this.state.menuSelect;
        ms.rngWithSwap = rngSwapOpt;
        this.setState({ menuSelect: ms });
        this.hexMap.rngWithSwap = settingOpts.rngWithSwap.optsVal[rngSwapOpt];
        this.evaluateMap();
    }

    onClickMinEqualDist(minEqDist) {
        var ms = this.state.menuSelect;
        ms.minEqDist = minEqDist;
        this.setState({ menuSelect: ms});
        this.hexMap.criteria.minEqDist = settingOpts.minEqDist.optsVal[minEqDist];
        this.evaluateMap();
    }

    onClickMaxClustSize(clustOpt) {
        var ms = this.state.menuSelect;
        ms.maxCluster = clustOpt;
        this.setState({ menuSelect: ms });
        this.hexMap.criteria.maxClusterSize = settingOpts.maxClustSize.optsVal[clustOpt];
        this.evaluateMap();
    }

    onClickMaxEdgeCount(edgeOpt) {
        var ms = this.state.menuSelect;
        ms.maxEdge = edgeOpt;
        this.setState({ menuSelect: ms });
        this.hexMap.criteria.maxEdgeCount = settingOpts.maxEdgeCount.optsVal[edgeOpt];
        this.evaluateMap();
    }

    onClickIgnoreOpt(ignoreOpt) {
        var ms = this.state.menuSelect;
        ms.ignoreOpt = ignoreOpt;
        this.setState({ menuSelect: ms });
        this.hexMap.criteria.ignoreNum = settingOpts.ignoreNum.optsVal[ignoreOpt];
        this.evaluateMap();
    }

    onClickShowSettings() {
        this.setState({ showSettings: !this.state.showSettings });
    }

    onClickDebug() {
        this.setState({ showDebug: !this.state.showDebug });
    }

    onClickRandom() {
        var [ok, failures] = this.hexMap.getRandomValidMap();
        if (ok) {
            this.evaluateMap();
        }
        //console.error("iterations: " + failures);
    }


    evaluateMap() {
        var i = this.hexMap.getMapValidity();
        
        this.setState({
            illegal: i !== 0,
        });
    }

    renderSettings() {
        if (this.state.showSettings) {
            return (
                <Menu
                    onClick={(numSec) => this.onClick(numSec)}
                    numSec={this.state.numSect}
                    onClickOpt={(variant) => this.onClickOpt(variant)}
                    secOpt={this.state.secOpt}
                    onClickBalance={() => this.onClickBalance()}
                    menuSelect={this.state.menuSelect}
                    onClickMinEqualDist={(minEqDist) => this.onClickMinEqualDist(minEqDist)}
                    onClickClustOpt={(clustOpt) => this.onClickMaxClustSize(clustOpt)}
                    onClickEdgeOpt={(edgeOpt) => this.onClickMaxEdgeCount(edgeOpt)}
                    onClickIgnoreOpt={(ignoreOpt) => this.onClickIgnoreOpt(ignoreOpt)}
                    onClickRngSwap={(rngOpt) => this.onClickRngSwap(rngOpt)}
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
                    onClickRandom={() => this.onClickRandom()}
                />
                {this.renderSettings()}
                <MapView
                    numSect={this.state.numSect}
                    sectors={this.hexMap.sectors}
                    rotations={this.hexMap.rotations}
                    onClick={(i) => this.onClickSector(i)}
                    selected={this.state.selected}
                    illegal={this.state.illegal}
                    showDebug={this.state.showDebug}
                    onClickHex={(hexInfo) => this.onClickHex(hexInfo)}
                    balanceStats={this.state.balanceStats}
                    hexInfo={this.state.hexInfo}
                    hexGrid={this.hexMap.hexGrid}
                    nbrMat={this.hexMap.nbrMat}
                    highEdge={this.hexMap.highestEdgeCount}
                    minEqDist={settingOpts.minEqDist.optsVal[this.state.menuSelect.minEqDist]}
                    maxClusterSize={settingOpts.maxClustSize.optsVal[this.state.menuSelect.maxCluster]}
                    maxEdge={settingOpts.maxEdgeCount.optsVal[this.state.menuSelect.maxEdge]}
                    
                />
                <ColorHappyView
                    colorHappy={this.hexMap.colorHappy}
                    ignoredNum={this.hexMap.criteria.ignoreNum}
                />
            </div>
        )
    }
}

export default App;
