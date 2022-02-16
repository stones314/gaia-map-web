import React from 'react';
import { settingOpts } from './Defs';
import './styles/Menu.css';

function getMetaRows(minEqDist, maxClust) {
    if (minEqDist === 2 && maxClust === 3) return [0,1];
    else if (minEqDist === 2 && maxClust === 5) return [2,3];
    else if (minEqDist === 2 && maxClust === 7) return [4];
    else if (minEqDist === 2 && maxClust === 99) return [0,1,2,3,4];
    else if (minEqDist === 3 && maxClust === 3) return [5,6];
    else if (minEqDist === 3 && maxClust === 5) return [7,8];
    else if (minEqDist === 3 && maxClust === 7) return [9];
    else if (minEqDist === 3 && maxClust === 99) return [5,6,7,8,9];
    else if (minEqDist === 0 && maxClust === 3) return [0, 1, 5, 6];
    else if (minEqDist === 0 && maxClust === 5) return [2, 3, 7, 8];
    else if (minEqDist === 0 && maxClust === 7) return [4, 9];
    else if (minEqDist === 0 && maxClust === 99) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    else return [-1];
}

export function mapMatchesSettings(mapRow, menuSelect) {
    if (settingOpts.minEqDist.optsVal[menuSelect.minEqDist] != 0)
        if (parseInt(mapRow.MinEqDist) != settingOpts.minEqDist.optsVal[menuSelect.minEqDist])
            return false;
    if (settingOpts.maxClustSize.optsVal[menuSelect.maxCluster] != 99)
        if (parseInt(mapRow.MaxClustSize) < settingOpts.maxClustSize.optsVal[menuSelect.maxCluster]
            || parseInt(mapRow.MaxClustSize) > settingOpts.maxClustSize.optsVal[menuSelect.maxCluster] + 1)
            return false;
    return true;
}

export function getMapCount(mapData, menuSelect) {
    const optLetter = "ABCDE";
    const col = "n" + menuSelect.numSec + optLetter[menuSelect.secOpt];
    const rows = getMetaRows(
        settingOpts.minEqDist.optsVal[menuSelect.minEqDist],
        settingOpts.maxClustSize.optsVal[menuSelect.maxCluster]);
    if (rows[0] < 0)
        return 0;
    var mapCount = 0;
    for (const [, row] of rows.entries())
        mapCount += parseInt(mapData["Meta"][row][col]);
    return mapCount;
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
