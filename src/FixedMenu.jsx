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
        if (this.props.showSettings)
            menuText = "Hide Settings";
        return (
            <div className="menu-fixed">
                <ModeSelect
                    onClickSwap={() => this.props.onClickSwap()}
                    onClickRot={() => this.props.onClickRot()}
                    swapMode={this.props.swapMode}
                />
                <div className="menu-row">
                    <button className="menu-show" onClick={this.props.onClickShowSettings}>
                        {menuText}
                    </button>
                    <button className="menu-show" onClick={this.props.onClickDebug}>
                        Debug
                    </button>
                </div>
            </div>
        )
    }
}

export default FixedMenu;