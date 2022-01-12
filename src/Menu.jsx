import React from 'react';
import './styles/Menu.css';
import { Settings, SelectOptionFromList } from './Settings';
import { settingOpts } from './Defs'

class NumSectorSelect extends React.Component {
    renderOpts() {
        const vars = [
            ['A', 'B', 'C', 'D', 'E'],
            ['A'],
            ['A', 'B'],
            ['A']
        ];
        var varClass = new Array(5).fill("menu-mode-btn");
        varClass[this.props.secOpt] += " menu-mode-sel";

        var rows = [];
        for (const [index, value] of vars[this.props.numSec - 7].entries()) {
            rows.push(
                <button key={index} className={varClass[index]} onClick={() => this.props.onClickVar(index)}>
                    {value}
                </button>
            );
        }
        return (
            <div className="menu-item">
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        Variant
                    </div>
                </div>
                <div className="menu-row">
                    {rows}
                </div>
            </div>
        );
    }

    render() {
        var nSecClass = new Array(4).fill("menu-mode-btn");
        nSecClass[this.props.numSec - 7] += " menu-mode-sel";

        const nSecs = [7, 8, 9, 10];

        var rows = [];
        for (const [index, value] of nSecs.entries()) {
            rows.push(
                <button key={index} className={nSecClass[index]} onClick={() => this.props.onClick(value)}>
                    {value}
                </button>
            );
        }

        return (
            <div className="menu-box-2">
                <div className="menu-item">
                    <div className="menu-row">
                        <div className="menu-mode-lbl">
                            Number of sectors
                    </div>
                    </div>
                    <div className="menu-row">
                        {rows}
                    </div>
                </div>
                {this.renderOpts()}
                <SelectOptionFromList
                    optName={settingOpts.rngWithSwap.text}
                    opts={settingOpts.rngWithSwap.optsView}
                    selectedOptIndex={this.props.menuSelect.rngWithSwap}
                    onClickOpt={(rngOpt) => this.props.onClickRngSwap(rngOpt)}
                />
            </div>
        )
    }
}

class MapStringInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.props.onMapStringChange(e.target.value);
    }
    handleSubmit(e) {
        this.props.onMapStringSubmit(e);
    }
    render() {
        return (
            <div className="string-inn-box">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Import by map string:
                    </label>
                    <input type="text" value={this.props.mapString} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                <text>
                    {this.props.errorMsg}
                </text>
            </div>
        );
    }
}

class Menu extends React.Component {
    render() {
        return (
            <div className="menu-box-0">
                <div className="menu-box">
                    <NumSectorSelect
                        onClick={(numSec) => this.props.onClick(numSec)}
                        numSec={this.props.numSec}
                        onClickVar={(variant) => this.props.onClickOpt(variant)}
                        secOpt={this.props.secOpt}
                        menuSelect={this.props.menuSelect}
                        onClickRngSwap={(rngOpt) => this.props.onClickRngSwap(rngOpt)}
                    />
                    <Settings
                        menuSelect={this.props.menuSelect}
                        onClickMinEqualDist={(minEqDist) => this.props.onClickMinEqualDist(minEqDist)}
                        onClickClustOpt={(clustOpt) => this.props.onClickClustOpt(clustOpt)}
                        onClickEdgeOpt={(edgeOpt) => this.props.onClickEdgeOpt(edgeOpt)}
                        onClickIgnoreOpt={(ignoreOpt) => this.props.onClickIgnoreOpt(ignoreOpt)}
                    />
                </div>
                <MapStringInput
                    onMapStringSubmit={(event) => this.props.onMapStringSubmit(event)}
                    onMapStringChange={(value) => this.props.onMapStringChange(value)}
                    mapString={this.props.mapString}
                    errorMsg={this.props.errorMsg}
                />
            </div>
        )
    }
}

export default Menu;
