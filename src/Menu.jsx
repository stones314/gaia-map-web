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
    renderOpts() {
        var opt0class = "menu-mode-btn";
        var opt1class = "menu-mode-btn";
        var opt2class = "menu-mode-btn";
        var opt3class = "menu-mode-btn";
        var opt4class = "menu-mode-btn";
        if (this.props.secOpt === 0)
            opt0class += " menu-mode-sel";
        else if (this.props.secOpt === 1)
            opt1class += " menu-mode-sel";
        else if (this.props.secOpt === 2)
            opt2class += " menu-mode-sel";
        else if (this.props.secOpt === 3)
            opt3class += " menu-mode-sel";
        else if (this.props.secOpt === 4)
            opt4class += " menu-mode-sel";

        if (this.props.numSec === 10)
            return;
        else if (this.props.numSec === 9)
            return (
                <div>
                    <div className="menu-row">
                        <div className="menu-mode-lbl">
                            <text>Select variant</text>
                        </div>
                    </div>
                    <div className="menu-row">
                        <button className={opt0class} onClick={this.props.onClickOpt0}>
                            A
                        </button>
                        <button className={opt1class} onClick={this.props.onClickOpt1}>
                            B
                        </button>
                    </div>
                </div>
            );
        else if (this.props.numSec === 8)
            return;
        else if (this.props.numSec === 7)
            return (
                <div>
                    <div className="menu-row">
                        <div className="menu-mode-lbl">
                            <text>Variant</text>
                        </div>
                    </div>
                    <div className="menu-row">
                        <button className={opt0class} onClick={this.props.onClickOpt0}>
                            A
                        </button>
                        <button className={opt1class} onClick={this.props.onClickOpt1}>
                            B
                        </button>
                        <button className={opt2class} onClick={this.props.onClickOpt2}>
                            C
                        </button>
                        <button className={opt3class} onClick={this.props.onClickOpt3}>
                            D
                        </button>
                        <button className={opt4class} onClick={this.props.onClickOpt4}>
                            E
                        </button>
                    </div>
                </div>
            );

    }

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
            <div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        <text>Number of sectors</text>
                    </div>
                </div>
                <div className="menu-row">
                    <button className={btn10class} onClick={this.props.onClick10}>
                        10
                    </button>
                    <button className={btn9class} onClick={this.props.onClick9}>
                        9
                    </button>
                    <button className={btn8class} onClick={this.props.onClick8}>
                        8
                    </button>
                    <button className={btn7class} onClick={this.props.onClick7}>
                        7
                    </button>
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
                    onClick10={() => this.props.onClick10()}
                    onClick9={() => this.props.onClick9()}
                    onClick8={() => this.props.onClick8()}
                    onClick7={() => this.props.onClick7()}
                    numSec={this.props.numSec}
                    onClickOpt0={() => this.props.onClickOpt0()}
                    onClickOpt1={() => this.props.onClickOpt1()}
                    onClickOpt2={() => this.props.onClickOpt2()}
                    onClickOpt3={() => this.props.onClickOpt3()}
                    onClickOpt4={() => this.props.onClickOpt4()}
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
