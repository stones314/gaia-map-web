import React from 'react';
import './styles/Map.css';
import { images, sectorCenter, getCenterRef, hexTypes, planets } from './Defs';
import { hasEqualNeighbour } from './calc/MapEvaluation';
import { getNeighbourMatrix, } from "./calc/MapInformation";
import { isTerraformable } from './calc/Basics';

export class HexMapView extends React.Component {
    renderSelHexImg(isSelected) {
        if (isSelected) {
            return (
                <img
                    className="hex-img-over"
                    src={images["WhiteMark"]}
                    alt="HSel"
                />
            )
        }
        else
            return;
    }
    renderInvalidIndicator(isEqual, isCluster, isEdge) {
        var imgRef = "";
        if (isCluster)
            imgRef = "YellowMark";
        else if (isEqual)
            imgRef = "RedGlowyMark";
        else if (isEdge)
            imgRef = "GrayMark";
        if (imgRef !== "") {
            return (
                <img
                    className="hex-img-over"
                    src={images[imgRef]}
                    alt="RedRing"
                />
            )
        }
        else
            return;
    }
    render() {
        var illegalClass = this.props.illegal ? " illegal" : " legal";
        var rows = [];
        for (const [row, hexes] of this.props.hexGrid.entries()) {
            var planets = [];
            for (const [col, hex] of hexes.entries()) {
                var ignored = (row > 12 && col > 12)
                    || (row > 9 && col > 21)
                    || (row > 10 && col > 17)
                    || (row > 14 && col > 7)
                    ;

                if (!ignored) {
                    var showRing = false;
                    var eqNbr = false;
                    var edgeErr = false;
                    var cluster = false;
                    var imgRef = hex["Type"];
                    var divClass = "hex-col-" + col + " rot" + ["Rot"];
                    if (imgRef != "No") {
                        if (this.props.hexInfo["Row"] === row && this.props.hexInfo["Col"] === col) {
                            showRing = this.props.showDebug;
                        }
                        if (isTerraformable(imgRef)) {
                            for (var r = 1; r < this.props.minEqDist; r++)
                                eqNbr |= hex[imgRef][r - 1] > 0;
                            if (hex["No"][0] > 0 && this.props.highEdge[1] > this.props.maxEdge && this.props.highEdge[0].includes(imgRef)) {
                                edgeErr = true;
                            }
                        }
                        for (const [i, [r, c]] of sectorCenter.entries()) {
                            if (row === r && col === c) {
                                imgRef = getCenterRef[hex["Sec"]];
                            }
                        }
                        if (hex["Cs"] > this.props.maxClusterSize)
                            cluster = true;
                        if (showRing) {
                            eqNbr = false;
                            cluster = false;
                            edgeErr = false;
                        }
                        planets.push(
                            <div
                                className={divClass}
                                key={col}
                                onClick={() => this.props.onClickHex(hex)}
                            >
                                {this.renderInvalidIndicator(eqNbr, cluster, edgeErr)}
                                {this.renderSelHexImg(showRing)}
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
            "Cs",
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


class NbrMatView extends React.Component {
    render() {
        var rows = [];
        for (const [i, planet] of planets.entries()) {
            var info = planet + ": ";
            for (const [j, nbr] of hexTypes.entries()) {
                info += nbr+"="+this.props.nbrMat[planet][nbr] + ", "
            }
            rows.push(
                <div key={i}>
                    {info}
                </div>
            );
        }
        return (
            <div className="hex-info-2">
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

    renderSector(slot, col) {
        var ignored = (slot === 11)
            || (slot === 0 && this.props.numSect !== 9);
        if (ignored) return null;
        return (
            <SectorView
                key={slot}
                sid={slot}
                numSect={this.props.numSect}
                sector={this.props.sectors[slot]}
                rotation={this.props.rotations[slot]}
                col={col}
                selected={this.props.selected === slot}
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

    renderNbrMat(doIt) {
        if (doIt) {
            return (
                <NbrMatView
                    nbrMat={this.props.nbrMat}
                />
            );
        }
        return null;
    }


    renderMap(doHexMap) {
            return (
                <div className="map-eval-box">
                    {this.renderRow(0)}
                    {this.renderRow(1)}
                    {this.renderRow(2)}
                    <HexMapView
                        sectors={this.props.sectors}
                        rotations={this.props.rotations}
                        onClickHex={(hexInfo) => this.props.onClickHex(hexInfo)}
                        hexInfo={this.props.hexInfo}
                        onClick={(i) => this.props.onClick(i)}
                        numSect={this.props.numSect}
                        minEqDist={this.props.minEqDist}
                        hexGrid={this.props.hexGrid}
                        maxClusterSize={this.props.maxClusterSize}
                        illegal={this.props.illegal}
                        showDebug={this.props.showDebug}
                        highEdge={this.props.highEdge}
                        maxEdge={this.props.maxEdge}
                    />
                    <HexInfoView
                        hexInfo={this.props.hexInfo}
                    />
                    {this.renderNbrMat(this.props.showDebug)}
                </div>
            );
    }

    render() {
        return (
            <div className="map-box">
                {this.renderMap(this.props.showDebug)}
            </div>
        )
    }
}
