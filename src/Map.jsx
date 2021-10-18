import React from 'react';
import './Map.css';
import { images, sectorCenter, getCenterRef } from './Defs';
import { makeHexMap, makeInfoMap, getNeighbourMatrix, hasEqualNeighbour } from './Evaluator';
import Evaluation from './Evaluation';

export class HexMapView extends React.Component {
    render() {
        var hexMap = makeHexMap(this.props.sectors, this.props.rotations);
        makeInfoMap(hexMap);
        var nbrMat = getNeighbourMatrix(hexMap);
        var hasEqNbr = hasEqualNeighbour(nbrMat, 2);
        var illegalClass = hasEqNbr ? " illegal" : " legal";
        var rows = [];
        for (const [row, hexes] of hexMap.entries()) {
            var planets = [];
            for (const [col, planet] of hexes.entries()) {
                if (col < 13 || row < 13) {
                    var imgClass = "hex-img";
                    var imgRef = planet["Type"];
                    var divClass = "hex-col-" + col + " rot" + hexMap[row][col]["Rot"];
                    if (imgRef != "No") {
                        if (this.props.hexInfo["Row"] === row && this.props.hexInfo["Col"] === col) {
                            imgClass += " hex-selected";
                        }
                        else if (this.props.hexInfo["Slot"] === planet["Slot"]) {
                            imgClass += " hex-sec-selected";
                        }
                        for (const [i, [r, c]] of sectorCenter.entries()) {
                            if (row === r && col === c) {
                                imgRef = getCenterRef[hexMap[row][col]["Sec"]];
                            }
                        }
                        planets.push(
                            <div
                                className={divClass}
                                key={col}
                            >
                                <img
                                    className={imgClass}
                                    src={images[imgRef]}
                                    onMouseOver={() => this.props.onClickHex(hexMap[row][col])}
                                    alt={planet["Type"]}
                                    onClick={() => this.props.onClick(hexMap[row][col]["Slot"])}
                                />
                            </div>
                        );
                    }
                }
            }
            rows.push(<div className={"hex-row-" + row} key={row}>{planets}</div>);
        }
        return (
            <div className={"hex-map" + illegalClass}>
                {rows}
            </div>
        )
    }

}

export class HexInfoView extends React.Component {
    render() {
        var keys = ["Sec", "Type", "Rot","Re", "Bl", "Wh", "Bk", "Br", "Ye", "Or", "Ga", "Tr", "Em", "No", "Slot"];
        var rows = [];
        for (const [i, key] of keys.entries()) {
            rows.push(
                <div>
                    {key + ": " + this.props.hexInfo[key]}
                </div>
            );
        }
        return (
            <div className="hex-info">
                {rows}
            </div>
        );
    }
}

class SectorView extends React.Component {
    getClassName(rot, col, sel, b) {
        var s = "rot" + rot +
            " map-col-" + col +
            " map-sec";
        if (sel)
            s = s + "-selected";
        if (b)
            s = s + " map-sec-border";
        return s;
    }

    render() {
        return (
            <div className={this.getClassName(this.props.rotation, this.props.col, this.props.selected, false)}>
                <img
                    src={images[this.props.sector]}
                    className="map-img"
                    onClick={this.props.onClick}
                    alt={this.props.sector}
                />
            </div>
        )
    }
}

export class MapView extends React.Component {

    renderSector(i, col) {
        return (
            <SectorView
                key={i}
                sid={i}
                numSect={this.props.numSect}
                sector={this.props.sectors[i]}
                rotation={this.props.rotations[i]}
                col={col}
                onClick={() => this.props.onClick(i)}
                selected={this.props.selected === i}
            />
        );
    }

    renderRow(row) {
        var rowClass = "map-row map-row-" + row;
        return (
            <div className={rowClass}>
                {this.renderSector(row * 4 + 0, 0)}
                {this.renderSector(row * 4 + 1, 1)}
                {this.renderSector(row * 4 + 2, 2)}
                {this.renderSector(row * 4 + 3, 3)}
            </div>
        );
    }

    renderMap(doHexMap) {
        if (doHexMap) {
            return (
                <div className="map-eval-box">
                    <HexMapView
                        sectors={this.props.sectors}
                        rotations={this.props.rotations}
                        onClickHex={(hexInfo) => this.props.onClickHex(hexInfo)}
                        hexInfo={this.props.hexInfo}
                        onClick={(i) => this.props.onClick(i)}
                    />
                    <HexInfoView
                        hexInfo={this.props.hexInfo}
                    />
                </div>
            );
        }
        else {
            return (
                <div className="map-eval-box">
                    {this.renderRow(0)}
                    {this.renderRow(1)}
                    {this.renderRow(2)}
                    <Evaluation balance={this.props.balanceStats} />
                </div>
            );
        }
    }


    render() {
        var illegalClass = this.props.illegal ? " illegal" : " legal";
        return (
            <div className={"map-box" + illegalClass}>
                {this.renderMap(this.props.showDebug)}
            </div>
        )
    }
}

