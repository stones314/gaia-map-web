import React from 'react';
import './styles/App.css';
import { MapView } from './Map';
import Menu from './Menu';
import Info from './Info';
import ErrorMsg from './ErrorMsg';
import MapDbInfo from './MapDbInfo';
import FixedMenu from './FixedMenu';
import ColorHappyView from './ColorHappyView';
import { HexMap } from './calc/HexMap';
import { settingOpts } from './Defs';
import { loadMaps, mapType } from './SheetAPI';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            landscape: false,
            selected: -1,
            mapId: 0,
            swapMode: false,
            numSect: 10,
            secOpt: 0,
            editMapString: "",
            mapString: "",
            showMenu: false,
            showStats: false,
            showDebug: false,
            showInfo: false,
            showError: false,
            errorMsg: "",
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
        this.onMapStringChange = this.onMapStringChange.bind(this);
        this.onMapStringSubmit = this.onMapStringSubmit.bind(this);
    }

    async componentDidMount() {

        this.mapdata = await loadMaps();
        this.hexMap.setFromString("s00.0-s10.0-s01.0-s05.0-s09.0-s02.0-s03.0-s06.0-s08.0-s04.0-s07.0-s00.0");
        this.evaluateMap();
        window.addEventListener('resize', this.checkLandscape);
        this.checkLandscape();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkLandscape);
    }

    checkLandscape = () => {
        var mq = window.matchMedia("(max-aspect-ratio: 210/152)");
        if (mq.matches != this.state.landscape)
            this.setState({ landscape: !this.state.landscape });
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
        this.onClickRandom();
    }

    onClickOpt(variant) {
        this.setState({
            secOpt: variant,
        });
        this.hexMap.newSectorSelection(this.state.numSect, variant);
        this.onClickRandom();
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

    onClickShowMenu() {
        if (this.state.showStats)
            this.setState({ showStats: false});
        this.setState({ showMenu: !this.state.showMenu });
    }
    onClickShowStats() {
        if (this.state.showMenu)
            this.setState({ showMenu: false });
        this.setState({ showStats: !this.state.showStats });
    }
    onClickShowInfo() {
        this.setState({ showInfo: !this.state.showInfo });
    }

    onMapStringSubmit(event) {
        var out = this.hexMap.setFromString(this.state.editMapString);
        event.preventDefault();
        if (!out.valid) {
            this.setState({ errorMsg: out.errorMsg, showError: true });
        }
        else {
            this.evaluateMap();
            this.setState({
                mapString: this.state.editMapString,
                editMapString: "",
                errorMsg: "",
                numSect: out.numSec,
                secOpt: out.secOpt
            });
        }
    }

    onMapStringChange(newValue) {
        this.setState({ editMapString: newValue});
    }

    onClickErrorOk() {
        this.setState({ showError: false });
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

    onClickNewBalancedMap() {
        var mT = mapType(this.state.numSect, this.state.secOpt);
        if (this.mapdata[mT].length < 1)
            return;
        var tmp = Math.floor(Math.random() * this.mapdata[mT].length);
        this.setState({ mapId: tmp });
        this.hexMap.setFromString(this.mapdata[mT][tmp].MapKey);
        this.evaluateMap();
    }

    evaluateMap() {
        var i = this.hexMap.getMapValidity();
        
        this.setState({
            illegal: i !== 0,
            mapString: this.hexMap.getMapString(),
        });
    }

    renderMenu() {
        if (this.state.showMenu) {
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
                    onMapStringChange={(value) => this.onMapStringChange(value)}
                    onMapStringSubmit={(event) => this.onMapStringSubmit(event)}
                    mapString={this.state.editMapString}
                    errorMsg={this.state.errorMsg}
                />
            );
        }
        else {
            return;
        }
    }

    renderError() {
        if (this.state.showError) {
            return (
                <ErrorMsg
                    onClickErrorOk={() => this.onClickErrorOk()}
                    errorMsg={this.state.errorMsg}
                />
            );
        }
        else {
            return;
        }
    }

    renderStats() {
        if (this.state.showStats) {
            return (
                <ColorHappyView
                    hexMap={this.hexMap}
                    landscape={this.state.landscape}
                />
            );
        }
        else {
            return;
        }
    }

    renderNonFixed() {
        if (this.state.showInfo) {
            return (
                <div>
                    <Info />
                    {this.renderMenu()}
                    {this.renderStats()}
                </div>
            );
        }
        else {
            return (
                <div>
                    {this.renderMenu()}
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
                    {this.renderStats()}
                </div>
            );
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
                    onClickShowSettings={() => this.onClickShowMenu()}
                    onClickDebug={() => this.onClickDebug()}
                    showSettings={this.state.showMenu == 1}
                    showDebug={this.state.showDebug}
                    onClickRandom={() => this.onClickRandom()}
                    onClickShowStats={() => this.onClickShowStats()}
                    showStats={this.state.showStats}
                    onClickNewBalancedMap={() => this.onClickNewBalancedMap()}
                    onClickShowInfo={() => this.onClickShowInfo()}
                    showInfo={this.state.showInfo}
                    mapString={this.state.mapString}
                />
                {this.renderNonFixed()}
            </div>
        )
    }
}

export default App;
