import React from 'react';
import './Map.css';
import { makeHexMap, getSecOpt } from './Defs';
import { makeInfoMap, getNeighbourMatrix, hasEqualNeighbour } from './Evaluator';

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
                    src={this.props.sector}
                    className="map-img"
                    onClick={this.props.onClick}
                    alt={this.props.sector}
                />
            </div>
        )
    }
}

class MapView extends React.Component {

    renderSector(i, col) {
        return (
            <SectorView
                key={i}
                sid={i}
                numSect={this.props.numSect}
                sector={this.props.sectors[i]}
                rotation={this.props.rotation[i]}
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

    render() {
        var illegalClass = this.props.illegal ? " illegal" : "";
        return (
            <div className={"map-box" + illegalClass}>
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
            </div>
        )
    }
}

export default MapView;
