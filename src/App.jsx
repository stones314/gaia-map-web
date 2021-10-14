import React from 'react';
import './App.css';
import MapView from './Map';
import Menu from './Menu';
import Settings from './Settings';
import Evaluation from './Evaluation';
import { makeHexMap, getSecOpt } from './Defs';

class HexMapView extends React.Component {
    render() {
        var hexMap = makeHexMap(this.props.sectors, this.props.rotations);
        var rows = [];
        for (const [row, hexes] of hexMap.entries()) {
            var planets = [];
            for (const [col, planet] of hexes.entries()) {
                planets.push(<div className={"hex-col-"+col+" hex-"+planet} key={col}></div>);
            }
            rows.push(<div className={"hex-row-"+row} key={row}>{planets}</div>);
        }
        return (
            <div className="hex-map">
                {rows}
            </div>
        )
    }

}

class ModeSelect extends React.Component {

    render() {
        var swapBtnClass = "menu-mode-btn";
        var rotBtnClass = "menu-mode-btn";
        if (this.props.swapMode) {
            swapBtnClass += " menu-mode-sel";
        }
        else {
            rotBtnClass += " menu-mode-sel";
        }
        return (
            <div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        Edit map by
                    </div>
                </div>
                <div className="menu-row">
                    <button className={swapBtnClass} onClick={this.props.onClickSwap}>
                        Swap
                    </button>
                    <button className={rotBtnClass} onClick={this.props.onClickRot}>
                        Rotate
                    </button>
                </div>
            </div>
        )
    }
}

class FixedMenu extends React.Component {
    render() {
        var menuText = "Show Settings";
        if (this.props.showMenu)
            menuText = "Hide Settings";
        return (
            <div className="menu-fixed">
                <ModeSelect
                    onClickSwap={() => this.props.onClickSwap()}
                    onClickRot={() => this.props.onClickRot()}
                    swapMode={this.props.swapMode}
                />
                <div className="menu-row">
                    <button className="menu-show" onClick={this.props.onClickShowMenu}>
                        {menuText}
                    </button>
                </div>
            </div>
        )
    }
}

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
            showMenu: false,
            showDebug: false,
        };
        this.onClickSector = this.onClickSector.bind(this);
        //this.onClickModeBtn = this.onClickModeBtn.bind(this);
    }

    onClickSector(i) {
        var rot = this.state.rotations.slice();
        if (this.state.swapMode) {
            if (this.state.selected < 0) {
                this.setState({ selected: i});
            } else if (this.state.selected === i) {
                this.setState({ selected: -1 });
            } else {
                var sec = this.state.sectors.slice();
                [sec[i], sec[this.state.selected]] = [sec[this.state.selected], sec[i]];
                [rot[i], rot[this.state.selected]] = [rot[this.state.selected], rot[i]];
                this.setState({ selected: -1, sectors: sec, rotations: rot });
            }
        }
        else {
            rot[i] = (rot[i] + 1) % 6;
            this.setState({ rotations: rot });
        }
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
    }

    onClickOpt(variant) {
        this.setState({ secOpt: variant, sectors: getSecOpt(this.state.numSect, variant) });
    }

    onClickShowMenu() {
        this.setState({ showMenu: !this.state.showMenu });
    }

    onClickDebug() {
        this.setState({ showDebug: !this.state.showDebug });
    }

    renderMap(doHexMap) {
        if (doHexMap) {
            return (
                <div className="map-eval-box">
                    <HexMapView
                        sectors={this.state.sectors}
                        rotations={this.state.rotations}
                    />
                </div>
            );
        }
        else {
            return (
                <div className="map-eval-box">
                    <MapView
                        numSect={this.state.numSect}
                        sectors={this.state.sectors}
                        rotation={this.state.rotations}
                        onClick={(i) => this.onClickSector(i)}
                        selected={this.state.selected}
                    />
                    <Evaluation />
                </div>
            );
        }
    }

    renderMenu() {
        if (this.state.showMenu) {
            return (
                <div className="menu-box">
                    <Menu
                        onClick={(numSec) => this.onClick(numSec)}
                        numSec={this.state.numSect}
                        onClickOpt={(variant) => this.onClickOpt(variant)}
                        secOpt={this.state.secOpt}
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
                {this.renderMap(this.state.showMenu)};
                <div className="menu-box">
                    <FixedMenu
                        onClickSwap={() => this.onClickSwap()}
                        onClickRot={() => this.onClickRot()}
                        swapMode={this.state.swapMode}
                        onClickShowMenu={() => this.onClickShowMenu()}
                        showMenu={this.state.showMenu}
                    />
                    {this.renderMenu()}
                </div>
            </div>
        )
    }
}

export default App;
