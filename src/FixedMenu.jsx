import React from 'react';
import './Menu.css';
import { images } from './Defs';

class FixedImgButton extends React.Component {
    render() {
        var btnClass = "img-btn "+ this.props.btnClass;
        if (this.props.isSelected) {
            btnClass += " img-btn-sel";
        }
        return (
            <div className={btnClass}>
                <img
                    className={this.props.imgClass}
                    src={images[this.props.imgRef]}
                    alt={this.props.imgAlt}
                    onClick={this.props.onClick}
                />
            </div>
        )
    }
}

class FixedMenu extends React.Component {
    render() {
        return (
            <div className="menu-fixed">
                <FixedImgButton
                    isSelected={this.props.showSettings}
                    onClick={this.props.onClickShowSettings}
                    btnClass="menu-btn"
                    imgClass="menu-btn-img"
                    imgRef="Cog"
                    imgAlt="Menu"
                />
                <FixedImgButton
                    onClick={() => this.props.onClickRot()}
                    isSelected={!this.props.swapMode}
                    btnClass="rot-btn"
                    imgClass="rot-btn-img"
                    imgRef="Rot"
                    imgAlt="Rotate"
                />
                <FixedImgButton
                    onClick={() => this.props.onClickSwap()}
                    isSelected={this.props.swapMode}
                    btnClass="swap-btn"
                    imgClass="swap-btn-img"
                    imgRef="Swap"
                    imgAlt="Swap"
                />
                <FixedImgButton
                    onClick={() => this.props.onClickDebug()}
                    isSelected={this.props.showDebug}
                    btnClass="hex-btn"
                    imgClass="hex-btn-img"
                    imgRef="HM"
                    imgAlt="HexMap"
                />
            </div>
        )
    }
}

export default FixedMenu;
