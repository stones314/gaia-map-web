import React from 'react';
import './styles/App.css';
import { MapView, MapString } from './Map';
import Menu from './Menu';
import Info from './Info';
import ErrorMsg from './ErrorMsg';
import { getMapCount, mapMatchesSettings } from './MapDbInfo';
import FixedMenu from './FixedMenu';
import ColorHappyView from './ColorHappyView';
import { HexMap } from './calc/HexMap';
import { settingOpts, advTech, baseTech, boosters, feds, roundVps, endVps } from './Defs';
import { loadMaps, mapType, reEvaluateMaps } from './SheetAPI';
import Setup from './Setup';
import { GetRandomElements, getSetupString, getSetupFromString } from './HelperFunctions';

class SetupString extends React.Component {
    render() {
        return (
            <div className="map-string-box">
                <text className="map-string-txt">
                    {this.props.setupString}
                </text>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            landscape: false,
            selected: -1,
            mapId: 0,
            editMapString: "",
            mapString: "",
            editSetupString: "",
            setupString: "",
            showMenu: false,
            showStats: false,
            showDebug: false,
            showInfo: false,
            showAlert: false,
            errorMsgMap: "",
            errorMsgSetup: "",
            alertMsg: "",
            illegal: false,
            menuSelect: {
                numPlayers: 4,
                numSec: 10,
                secOpt: 0,
                swapMode: false,
                rotMode: false,
                minEqDist: settingOpts.minEqDist.defaultId,
                maxCluster: settingOpts.maxClustSize.defaultId,
                maxEdge: settingOpts.maxEdgeCount.defaultId,
                rngWithSwap: settingOpts.rngWithSwap.defaultId,
                ignoreOpt: settingOpts.ignoreNum.defaultId,
            },
            setup: {
                feds: GetRandomElements(feds, 1),
                advTech: GetRandomElements(advTech, 6),
                baseTech: GetRandomElements(baseTech, 6),
                rounds: GetRandomElements(roundVps, 6),
                boosts: GetRandomElements(boosters, 7),
                endVps: GetRandomElements(endVps, 2),
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

        var reevaluateMaps = false;
        if (reevaluateMaps) {
            var error = await reEvaluateMaps();
            if (error != "") {
                this.setState({ alertMsg: "Error: " + error, showAlert: true });
            }
        }

        this.setState({ loading: false });
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
        if (this.state.menuSelect.swapMode) {
            if (this.state.selected < 0) {
                this.setState({ selected: slot});
            } else if (this.state.selected === slot) {
                this.setState({ selected: -1 });
            } else {
                this.hexMap.swapSec(slot, this.state.selected);
                this.setState({ selected: -1});
            }
        }
        else if (this.state.menuSelect.rotMode) {
            this.hexMap.rotateSec(slot);
        }
        this.evaluateMap();
    }

    onClickHex(hexInfo) {
        if (this.state.menuSelect.swapMode || this.state.menuSelect.rotMode) {
            this.onClickSector(hexInfo["Slot"]);
        }
        this.setState({ hexInfo: hexInfo });
    }

    onClickSwap() {
        if (this.state.loading) return;
        var ms = this.state.menuSelect;
        ms.swapMode = !ms.swapMode;
        ms.rotMode = false;
        this.setState({ menuSelect: ms });
    }

    onClickRot() {
        if (this.state.loading) return;
        var ms = this.state.menuSelect;
        ms.swapMode = false;
        ms.rotMode = !ms.rotMode;
        this.setState({ menuSelect: ms });
    }

    onClick(numSec) {
        var ms = this.state.menuSelect;
        ms.numSec = numSec;
        ms.secOpt = 0;
        this.setState({ menuSelect: ms });
        this.hexMap.newSectorSelection(numSec, 0);
        this.evaluateMap();
    }

    onClickOpt(variant) {
        var ms = this.state.menuSelect;
        ms.secOpt = variant;
        this.setState({ menuSelect: ms });
        this.hexMap.newSectorSelection(this.state.menuSelect.numSec, variant);
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

    onClickShowMenu() {
        if (this.state.loading) return;
        if (this.state.showStats)
            this.setState({ showStats: false});
        this.setState({ showMenu: !this.state.showMenu });
    }
    onClickShowStats() {
        if (this.state.loading) return;
        if (this.state.showMenu)
            this.setState({ showMenu: false });
        this.setState({ showStats: !this.state.showStats });
    }
    onClickShowInfo() {
        if (this.state.loading) return;
        this.setState({ showInfo: !this.state.showInfo });
    }

    onMapStringSubmit(event) {
        var out = this.hexMap.setFromString(this.state.editMapString);
        event.preventDefault();
        if (!out.valid) {
            this.setState({ errorMsgMap: out.errorMsg, showError: true });
        }
        else {
            this.evaluateMap();
            var ms = this.state.menuSelect;
            ms.numSec = out.numSec;
            ms.secOpt = out.secOpt;
            this.setState({
                mapString: this.state.editMapString,
                editMapString: "",
                errorMsgMap: "",
                menuSelect: ms
            });
        }
    }

    onMapStringChange(newValue) {
        this.setState({ editMapString: newValue});
    }

    onSetupStringSubmit(event) {
        var out = getSetupFromString(this.state.editSetupString);
        event.preventDefault();
        if (!out.valid) {
            this.setState({ errorMsgSetup: out.errorMsg, showError: true });
        }
        else {
            this.evaluateMap();
            this.setState({
                setupString: this.state.setupString,
                editSetupString: "",
                errorMsgSetup: "",
                setup: out.setup,
            });
        }
    }

    onSetupStringChange(newValue) {
        this.setState({ editSetupString: newValue });
    }

    onClickErrorOk() {
        this.setState({ showAlert: false });
    }

    onClickDebug() {
        this.setState({ showDebug: !this.state.showDebug });
    }

    onClickRandom() {
        if (this.state.loading) return;
        var setup = this.state.setup;
        setup.feds = GetRandomElements(feds, 1);
        setup.advTech = GetRandomElements(advTech, 6);
        setup.baseTech = GetRandomElements(baseTech, 6);
        setup.rounds = GetRandomElements(roundVps, 6);
        setup.boosts = GetRandomElements(boosters, 7);
        setup.endVps = GetRandomElements(endVps, 2);
        this.setState({ setup: setup })
        var [ok, failures] = this.hexMap.getRandomValidMap();
        if (ok) {
            this.evaluateMap();
        }
    }

    onClickNewBalancedMap() {
        if (this.state.loading) return;
        const nMaps = getMapCount(this.mapdata, this.state.menuSelect);
        if (nMaps < 1)
            return;
        var mT = mapType(this.state.menuSelect.numSec, this.state.menuSelect.secOpt);
        var row = Math.floor(Math.random() * this.mapdata[mT].length);
        while (!mapMatchesSettings(this.mapdata[mT][row], this.state.menuSelect)) {
            row = Math.floor(Math.random() * this.mapdata[mT].length);
        }
        this.setState({ mapId: row });
        this.hexMap.setFromString(this.mapdata[mT][row].MapKey);
        this.evaluateMap();
    }

    evaluateMap() {
        var i = this.hexMap.getMapValidity();
        
        this.setState({
            illegal: i !== 0,
            mapString: this.hexMap.getMapString(),
            setupString: getSetupString(this.state.setup),
        });
    }

    renderMenu() {
        if (this.state.showMenu) {
            return (
                <Menu
                    onClick={(numSec) => this.onClick(numSec)}
                    onClickOpt={(variant) => this.onClickOpt(variant)}
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
                    errorMsgMap={this.state.errorMsgMap}
                    mapData={this.mapdata}
                    onSetupStringChange={(value) => this.onSetupStringChange(value)}
                    onSetupStringSubmit={(event) => this.onSetupStringSubmit(event)}
                    setupString={this.state.editSetupString}
                    errorMsgSetup={this.state.errorMsgSetup}
                />
            );
        }
        else {
            return;
        }
    }

    renderError() {
        if (this.state.showAlert) {
            return (
                <ErrorMsg
                    onClickErrorOk={() => this.onClickErrorOk()}
                    errorMsg={this.state.alertMsg}
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
                    <Info
                        menuSelect={this.state.menuSelect}
                        onClick={(numSec) => this.onClick(numSec)}
                        onClickOpt={(variant) => this.onClickOpt(variant)}
                        hexMap={this.hexMap}
                        landscape={this.state.landscape}
                        mapData={this.mapdata}
                        onClickMinEqualDist={(minEqDist) => this.onClickMinEqualDist(minEqDist)}
                        onClickClustOpt={(clustOpt) => this.onClickMaxClustSize(clustOpt)}
                        onClickEdgeOpt={(edgeOpt) => this.onClickMaxEdgeCount(edgeOpt)}
                        onClickRngSwap={(rngOpt) => this.onClickRngSwap(rngOpt)}
                        onMapStringChange={(value) => this.onMapStringChange(value)}
                        onMapStringSubmit={(event) => this.onMapStringSubmit(event)}
                        mapString={this.state.editMapString}
                        errorMsgMap={this.state.errorMsgMap}
                        onSetupStringChange={(value) => this.onSetupStringChange(value)}
                        onSetupStringSubmit={(event) => this.onSetupStringSubmit(event)}
                        setupString={this.state.editSetupString}
                        errorMsgSetup={this.state.errorMsgSetup}
                    />
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
                        numSec={this.state.menuSelect.numSec}
                        sectors={this.hexMap.sectors}
                        rotations={this.hexMap.rotations}
                        onClick={(i) => this.onClickSector(i)}
                        selected={this.state.selected}
                        illegal={this.state.illegal}
                        showDebug={this.state.showDebug}
                        onClickHex={(hexInfo) => this.onClickHex(hexInfo)}
                        hexInfo={this.state.hexInfo}
                        hexGrid={this.hexMap.hexGrid}
                        nbrMat={this.hexMap.nbrMat}
                        highEdge={this.hexMap.highestEdgeCount}
                        minEqDist={settingOpts.minEqDist.optsVal[this.state.menuSelect.minEqDist]}
                        maxClusterSize={settingOpts.maxClustSize.optsVal[this.state.menuSelect.maxCluster]}
                        maxEdge={settingOpts.maxEdgeCount.optsVal[this.state.menuSelect.maxEdge]}
                        loading={this.state.loading}
                    />
                    {this.renderStats()}
                    <MapString mapString={this.state.loading ? "Loading Data from DB" : "Map: " + this.state.mapString} />
                    <SetupString setupString={this.state.loading ? "" : "Setup: " + this.state.setupString} />
                    <Setup setup={this.state.setup} />
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
                    swapMode={this.state.menuSelect.swapMode}
                    rotMode={this.state.menuSelect.rotMode}
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
                    loading={this.state.loading}
                />
                {this.renderNonFixed()}
                {this.renderError()}
            </div>
        )
    }
}

export default App;
