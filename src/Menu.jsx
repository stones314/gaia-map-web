import React from 'react';
import './Menu.css';

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
                        <text>Edit map by</text>
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

class NumSectorSelect extends React.Component {
    renderOpts(secId) {
        const numVars = [5, 1, 2, 1];
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
                <button className={varClass[index]} onClick={() => this.props.onClickOpt(index)}>
                    {value}
                </button>
            );
        }
        return (
            <div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        <text>Variant</text>
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
                <button className={nSecClass[index]} onClick={() => this.props.onClick(value)}>
                    {value}
                </button>
            );
        }

        return (
            <div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        <text>Number of sectors</text>
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
            <div className="menu-box-2">
                <NumSectorSelect
                    onClick={(numSec) => this.props.onClick(numSec)}
                    numSec={this.props.numSec}
                    onClickOpt={(variant) => this.props.onClickOpt(variant)}
                    secOpt={this.props.secOpt}
                />
                <ModeSelect
                    onClickSwap={() => this.props.onClickSwap()}
                    onClickRot={() => this.props.onClickRot()}
                    swapMode={this.props.swapMode}
                />
            </div>
        )
    }
}

export default Menu;
