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

class PlanetStats extends React.Component {

    render() {
        return (
            <div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        <text>Map Evaluation</text>
                    </div>
                </div>
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        <text>Some Data</text>
                    </div>
                </div>
            </div>
        )
    }
}

class  extends React.Component {
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
