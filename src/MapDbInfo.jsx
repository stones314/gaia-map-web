import React from 'react';
import { settingOpts } from './Defs';
import './styles/Menu.css';

function getMetaRow(minEqDist, maxClust, maxEdge) {
    if (minEqDist === 2 && maxClust === 4 && maxEdge === 1) return 0;
    else if (minEqDist === 2 && maxClust === 4 && maxEdge === 2) return 1;
    else if (minEqDist === 2 && maxClust === 4 && maxEdge === 99) return 2;
    else if (minEqDist === 2 && maxClust === 5 && maxEdge === 1) return 3;
    else if (minEqDist === 2 && maxClust === 5 && maxEdge === 2) return 4;
    else if (minEqDist === 2 && maxClust === 5 && maxEdge === 99) return 5;
    else if (minEqDist === 2 && maxClust === 6 && maxEdge === 1) return 6;
    else if (minEqDist === 2 && maxClust === 6 && maxEdge === 2) return 7;
    else if (minEqDist === 2 && maxClust === 6 && maxEdge === 99) return 8;
    else if (minEqDist === 2 && maxClust === 99 && maxEdge === 1) return 9;
    else if (minEqDist === 2 && maxClust === 99 && maxEdge === 2) return 10;
    else if (minEqDist === 2 && maxClust === 99 && maxEdge === 99) return 11;
    else if (minEqDist === 3 && maxClust === 4 && maxEdge === 1) return 12;
    else if (minEqDist === 3 && maxClust === 4 && maxEdge === 2) return 13;
    else if (minEqDist === 3 && maxClust === 4 && maxEdge === 99) return 14;
    else if (minEqDist === 3 && maxClust === 5 && maxEdge === 1) return 15;
    else if (minEqDist === 3 && maxClust === 5 && maxEdge === 2) return 16;
    else if (minEqDist === 3 && maxClust === 5 && maxEdge === 99) return 17;
    else if (minEqDist === 3 && maxClust === 6 && maxEdge === 1) return 18;
    else if (minEqDist === 3 && maxClust === 6 && maxEdge === 2) return 19;
    else if (minEqDist === 3 && maxClust === 6 && maxEdge === 99) return 20;
    else if (minEqDist === 3 && maxClust === 99 && maxEdge === 1) return 21;
    else if (minEqDist === 3 && maxClust === 99 && maxEdge === 2) return 22;
    else if (minEqDist === 3 && maxClust === 99 && maxEdge === 99) return 23;
    else return -1;
}

export function mapMatchesSettings(mapRow, menuSelect) {
    if (parseInt(mapRow.MinEqDist) != settingOpts.minEqDist.optsVal[menuSelect.minEqDist]) return false;
    if (settingOpts.maxClustSize.optsVal[menuSelect.maxCluster] != 99)
        if (parseInt(mapRow.MaxClustSize) != settingOpts.maxClustSize.optsVal[menuSelect.maxCluster]) return false;
    if (settingOpts.maxEdgeCount.optsVal[menuSelect.maxEdge] != 99)
        if (parseInt(mapRow.MaxEdgePlanet) != settingOpts.maxEdgeCount.optsVal[menuSelect.maxEdge]) return false;
    return true;
}

export function getMapCount(mapData, menuSelect) {
    const row = getMetaRow(
        settingOpts.minEqDist.optsVal[menuSelect.minEqDist],
        settingOpts.maxClustSize.optsVal[menuSelect.maxCluster],
        settingOpts.maxEdgeCount.optsVal[menuSelect.maxEdge]);
    if (row < 0 || row > mapData["Meta"].length)
        return 0;
    if     (menuSelect.numSec === 10 && menuSelect.secOpt === 0) return mapData["Meta"][row].n10;
    else if (menuSelect.numSec === 9 && menuSelect.secOpt === 0) return mapData["Meta"][row].n9A;
    else if (menuSelect.numSec === 9 && menuSelect.secOpt === 1) return mapData["Meta"][row].n9B;
    else if (menuSelect.numSec === 8 && menuSelect.secOpt === 0) return mapData["Meta"][row].n8;
    else if (menuSelect.numSec === 7 && menuSelect.secOpt === 0) return mapData["Meta"][row].n7A;
    else if (menuSelect.numSec === 7 && menuSelect.secOpt === 1) return mapData["Meta"][row].n7B;
    else if (menuSelect.numSec === 7 && menuSelect.secOpt === 2) return mapData["Meta"][row].n7C;
    else if (menuSelect.numSec === 7 && menuSelect.secOpt === 3) return mapData["Meta"][row].n7D;
    else if (menuSelect.numSec === 7 && menuSelect.secOpt === 4) return mapData["Meta"][row].n7E;
    else return 0;
}

class MapDbInfo extends React.Component {
    render() {

        return (
            <div className="num-map-box">
                <div className="num-map-txt">
                    Available Maps in Db: {getMapCount(this.props.mapData, this.props.menuSelect)}
                </div>
            </div>
        )
    }
}

export default MapDbInfo;
