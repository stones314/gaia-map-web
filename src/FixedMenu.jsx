import React from 'react';
import './styles/Menu.css';
import { images } from './Defs';

class FixedImgButton extends React.Component {
    render() {
        var btnClass = "img-btn";
        if (this.props.isSelected) {
            btnClass += " img-btn-sel";
        }
        return (
            <div className={btnClass}>
                <img
                    className="btn-img"
                    src={images[this.props.imgRef]}
                    alt={this.props.imgAlt}
                    onClick={this.props.onClick}
                />
            </div>
        )
    }
}

class FixedMenu extends React.Component {
    renderDebug(showDebug) {
        if (!showDebug) return null;
        return (
            <FixedImgButton
                onClick={() => this.props.onClickDebug()}
                isSelected={!this.props.showDebug}
                imgRef="SM"
                imgAlt="SectorMap"
            />
        );
    }

    render() {
        return (
            <div className="menu-fixed-top">
                <div className="menu-fixed-btns">
                    <FixedImgButton
                        isSelected={this.props.showSettings}
                        onClick={this.props.onClickShowSettings}
                        imgRef="Cog"
                        imgAlt="Menu"
                    />
                    <FixedImgButton
                        onClick={() => this.props.onClickShowStats()}
                        isSelected={this.props.showStats}
                        imgRef="Stats"
                        imgAlt="Stats"
                    />
                    <FixedImgButton
                        onClick={() => this.props.onClickNewBalancedMap()}
                        isSelected={false}
                        imgRef="pBalance"
                        imgAlt="Stats"
                    />
                    <FixedImgButton
                        onClick={() => this.props.onClickRandom()}
                        isSelected={false}
                        imgRef="Random"
                        imgAlt="RNG"
                    />
                    {this.renderDebug(false)}
                    <FixedImgButton
                        onClick={() => this.props.onClickRot()}
                        isSelected={this.props.rotMode}
                        imgRef="Rot"
                        imgAlt="Rotate"
                    />
                    <FixedImgButton
                        onClick={() => this.props.onClickSwap()}
                        isSelected={this.props.swapMode}
                        imgRef="Swap"
                        imgAlt="Swap"
                    />
                    <FixedImgButton
                        onClick={() => this.props.onClickShowInfo()}
                        isSelected={this.props.showInfo}
                        imgRef="Info"
                        imgAlt="Info"
                    />
                </div>
            </div>
        )
    }
}

export default FixedMenu;
