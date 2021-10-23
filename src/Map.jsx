import React from 'react';
import './styles/Map.css';
import { images, sectorCenter, getCenterRef } from './Defs';
import { hasEqualNeighbour } from './calc/MapEvaluation';
import { getNeighbourMatrix, } from "./calc/MapInformation";

export class HexMapView extends React.Component {
    renderSelHexImg(isSelected) {
        if (isSelected) {
            return (
                <img
                    className="hex-img-over"
                    src={images["HSel"]}
                    alt="HSel"
                />
            )
        }
        else
            return;
    }
    renderEqNbrIndicator(isEqual, hexInfo) {
        if (isEqual) {
            return (
                <img
                    className="hex-img-over"
                    src={images["RedRing"]}
                    alt="RedRing"
                    onMouseOver={() => this.props.onClickHex(hexInfo)}
                />
            )
        }
        else
            return;
    }
    render() {
        var nbrMat = getNeighbourMatrix(this.props.hexMap);
        var hasEqNbr = hasEqualNeighbour(nbrMat, this.props.minEqDist);
        var illegalClass = hasEqNbr ? " illegal" : " legal";
        var rows = [];
        for (const [row, hexes] of this.props.hexMap.entries()) {
            var planets = [];
            for (const [col, hex] of hexes.entries()) {
                var ignored = (row > 12 && col > 12)
                    || (row > 9 && col > 21)
                    || (row > 10 && col > 17)
                    || (row > 14 && col > 7)
                    || (hex["Sec"] === "s00")
                    ;

                if (!ignored) {
                    var showRing = false;
                    var eqNbr = false;
                    var imgClass = "hex-img";
                    var imgRef = hex["Type"];
                    var divClass = "hex-col-" + col + " rot" + this.props.hexMap[row][col]["Rot"];
                    if (imgRef != "No") {
                        if (this.props.hexInfo["Row"] === row && this.props.hexInfo["Col"] === col) {
                            if (imgRef == "Em" || imgRef == "Fr")
                                imgClass += " hex-selected";
                            else
                                showRing = true;
                        }
                        else if (this.props.hexInfo["Slot"] === hex["Slot"]) {
                            imgClass += " hex-sec-selected";
                        }
                        if (imgRef != "Em" && imgRef != "Fr" && imgRef != "Tr" && imgRef != "Ga") {
                            for (var r = 2; r < this.props.minEqDist; r++)
                                eqNbr |= this.props.hexMap[row][col][imgRef][r-1] > 0;
                        }
                        for (const [i, [r, c]] of sectorCenter.entries()) {
                            if (row === r && col === c) {
                                imgRef = getCenterRef[this.props.hexMap[row][col]["Sec"]];
                            }
                        }
                        if (showRing)
                            eqNbr = false;
                        planets.push(
                            <div
                                className={divClass}
                                key={col}
                            >
                                {this.renderEqNbrIndicator(eqNbr, this.props.hexMap[row][col])}
                                {this.renderSelHexImg(showRing)}
                                <img
                                    className={imgClass}
                                    src={images[imgRef]}
                                    onMouseOver={() => this.props.onClickHex(this.props.hexMap[row][col])}
                                    alt={hex["Type"]}
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
        var keys = [
            "Sec",
            "Type",
            "Slot",
            "Row",
            "Col",
            "Re",
            "Bl",
            "Wh",
            "Bk",
            "Br",
            "Ye",
            "Or",
            "Ga",
            "Tr",
            "T0",
            "T1",
            "T2",
            "T3",
            "Em",
            "No",
            "Nbr",
        ];
        if (!this.props.hexInfo["No"])
            return null;
        var rows = [];
        for (const [i, key] of keys.entries()) {
            var sum = "";
            if (key === "Nbr")
                sum += "("+(this.props.hexInfo[key][0]
                    + this.props.hexInfo[key][1]
                    + this.props.hexInfo[key][2])+")";
            rows.push(
                <div key={key}>
                    {key + ": " + this.props.hexInfo[key] + sum}
                </div>
            );
        }
        var a = 6 - this.props.hexInfo["Nbr"][0];
        var b = 12 - this.props.hexInfo["Nbr"][1];
        var c = 18 - this.props.hexInfo["Nbr"][2]
        rows.push(
            <div key="---">
                {"---: [" + a
                    + ", " + b
                    + ", " + c
                    + "]("+(a+b+c) + ")"
                }
            </div>
        );
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
        var ignored = (i === 11)
            || (i === 0 && this.props.numSect !== 9);
        if (ignored) return null;
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
                        numSect={this.props.numSect}
                        minEqDist={this.props.minEqDist}
                        hexMap={this.props.hexMap}
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
                </div>
            );
        }
    }

    render() {
        return (
            <div className="map-box">
                {this.renderMap(this.props.showDebug)}
            </div>
        )
    }
}

