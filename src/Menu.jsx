import React from 'react';
import './styles/Menu.css';
import MapDbInfo from './MapDbInfo';
import { Settings, SelectOptionFromList } from './Settings';
import { settingOpts } from './Defs'

export class NumSectorSelect extends React.Component {
    renderOpts() {
        const vars = [
            ['A', 'B', 'C', 'D', 'E'],
            ['A'],
            ['A', 'B'],
            ['A']
        ];
        var varClass = new Array(5).fill("menu-mode-btn");
        varClass[this.props.menuSelect.secOpt] += " menu-mode-sel";

        var rows = [];
        for (const [index, value] of vars[this.props.menuSelect.numSec - 7].entries()) {
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
        nSecClass[this.props.menuSelect.numSec - 7] += " menu-mode-sel";

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
            </div>
        )
    }
}

export class StringInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.props.onStringChange(e.target.value);
    }
    handleSubmit(e) {
        this.props.onStringSubmit(e);
    }
    render() {
        return (
            <div className="string-inn-box">
                <text>
                    {this.props.description}
                </text>
                <text style={{ color: "purple" }}>
                    {this.props.errorMsg}
                </text>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.props.textString} onChange={this.handleChange} />
                    <input type="submit" value="Import" />
                </form>
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
                        onClickVar={(variant) => this.props.onClickOpt(variant)}
                        menuSelect={this.props.menuSelect}
                    />
                    <Settings
                        menuSelect={this.props.menuSelect}
                        onClickMinEqualDist={(minEqDist) => this.props.onClickMinEqualDist(minEqDist)}
                        onClickClustOpt={(clustOpt) => this.props.onClickClustOpt(clustOpt)}
                        onClickEdgeOpt={(edgeOpt) => this.props.onClickEdgeOpt(edgeOpt)}
                        onClickIgnoreOpt={(ignoreOpt) => this.props.onClickIgnoreOpt(ignoreOpt)}
                        onClickRngSwap={(rngOpt) => this.props.onClickRngSwap(rngOpt)}
                        onClickPlayerCount={(numPlayers) => this.props.onClickPlayerCount(numPlayers)}
                    />
                </div>
                <MapDbInfo
                    mapData={this.props.mapData}
                    menuSelect={this.props.menuSelect}
                />
            </div>
        )
    }
}

export default Menu;
