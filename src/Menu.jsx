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
                <div className="menu-box-2">
                    <button
                        className="menu-label"
                        onClick={this.props.onClickRandom}>
                        Random Valid Map
                        </button>
                </div>
            </div>
        )
    }
}

export default Menu;
