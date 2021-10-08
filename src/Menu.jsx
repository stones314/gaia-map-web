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
            <div className="menu-row">
                <div className={swapBtnClass} onClick={this.props.onClickSwap}>
                    <text>Swap</text>
                </div>
                <div className={rotBtnClass} onClick={this.props.onClickRot}>
                    <text>Rotate</text>
                </div>
            </div>
        )
    }
}

class NumSectorSelect extends React.Component {
    render() {
        var btn10class = "menu-mode-btn";
        var btn9class = "menu-mode-btn";
        var btn8class = "menu-mode-btn";
        var btn7class = "menu-mode-btn";
        if (this.props.numSec === 10)
            btn10class += " menu-mode-sel";
        else if (this.props.numSec === 9)
            btn9class += " menu-mode-sel";
        else if (this.props.numSec === 8)
            btn8class += " menu-mode-sel";
        else if (this.props.numSec === 7)
            btn7class += " menu-mode-sel";

        return (
            <div className="menu-row">
                <div className={btn10class} onClick={this.props.onClick10}>
                    <text>10</text>
                </div>
                <div className={btn9class} onClick={this.props.onClick9}>
                    <text>9</text>
                </div>
                <div className={btn8class} onClick={this.props.onClick8}>
                    <text>8</text>
                </div>
                <div className={btn7class} onClick={this.props.onClick7}>
                    <text>7</text>
                </div>
            </div>
        )
    }
}

class Menu extends React.Component {
    render() {
        return (
            <div className="menu-box">
                <ModeSelect
                    onClickSwap={() => this.props.onClickSwap()}
                    onClickRot={() => this.props.onClickRot()}
                    swapMode={this.props.swapMode}
                />
                <NumSectorSelect
                    onClick10={() => this.props.onClick10()}
                    onClick9={() => this.props.onClick9()}
                    onClick8={() => this.props.onClick8()}
                    onClick7={() => this.props.onClick7()}
                    numSec={this.props.numSec}
                />
            </div>
        )
    }
}

export default Menu;
