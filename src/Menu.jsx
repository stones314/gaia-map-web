import React from 'react';
import './Menu.css';
import Settings from './Settings';

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
                <button key={index} className={varClass[index]} onClick={() => this.props.onClickOpt(index)}>
                    {value}
                </button>
            );
        }
        return (
            <div>
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
            <div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        Number of sectors
                    </div>
                </div>
                <div className="menu-row">
                    {rows}
                </div>
                {this.renderOpts()}
            </div>
        )
    }
}

class Menu extends React.Component {
    render() {
        return (
            <div className="menu-box">
                <NumSectorSelect
                    onClick={(numSec) => this.props.onClick(numSec)}
                    numSec={this.props.numSec}
                    onClickOpt={(variant) => this.props.onClickOpt(variant)}
                    secOpt={this.props.secOpt}
                />
                <Settings
                    minEqDist={this.props.minEqDist}
                    onClickMinEqualDist={(minEqDist) => this.props.onClickMinEqualDist(minEqDist)}
                    rngWithSwap={this.props.rngWithSwap}
                    onClickRngSwap={(doSwap) => this.props.onClickRngSwap(doSwap)}
                />
                <div className="menu-row">
                    <button onClick={this.props.onClickRandom}>Randomize</button>
                </div>
            </div>
        )
    }
}

export default Menu;
