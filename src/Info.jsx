import React from 'react';
import './styles/Menu.css';
import { SelectOptionFromList } from './Settings';
import { NumSectorSelect, StringInput } from './Menu';
import MapDbInfo from './MapDbInfo';
import { MapString } from './Map';
import { SetupString } from './Setup';

import { Histogram } from './ColorHappyView';
import {
    settingOpts,
    images,
    getSecOpt,
    metrics,
    colorWheel,
    sectorToLetter,
    fedToLetter,
    advTechToLetter,
    baseTechToLetter,
    roundVpToLetter,
    endVpToLetter,
    boosterToLetter,
} from './Defs'
import { sectorList, sectorName } from './calc/MapManipulation';

class InfoElement extends React.Component {

    renderImg() {
        var imgClass = "img-btn";
        if (this.props.imgRef === "none") return null;
        if (this.props.imgClass === "info-hex-mark-img")
            imgClass = this.props.imgClass;
        return (
            <div className={imgClass}>
                <img
                    className="info-img"
                    src={images[this.props.imgRef]}
                    alt={this.props.imgRef}
                />
            </div>
        );
    }

    render() {
        var childClass = "info-child-col";
        if (this.props.childDir === "row")
            childClass = "info-child-row";
        return (
            <div className="info-element">
                {this.renderImg()}
                <div className={childClass}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class SectorInfo extends React.Component {

    render() {
        var row = [];
        for (const [i, p] of this.props.sectors.entries()) {
            if (p === "s00") continue;
            row.push(
                <div className="rot0">
                    <img
                        src={images[p]}
                        className="info-sec-img"
                        alt={p}
                    />
                </div>
            );
        }
        return (
            <div className="info-sec-row">
                {row}
            </div>
        )
    }
}

class CompInfo extends React.Component {

    render() {
        var comps = [];
        for (const key in this.props.components) {
            comps.push(
                <div key={key} className="info-comp">
                    <div className="info-comp-img-div">
                    <img
                        src={images[key]}
                        className="info-comp-img"
                        alt={key}
                    />
                    </div>
                    <div className="info-comp-letter">
                        {this.props.components[key]}
                    </div>
                </div>
            );
        }
        return (
            <div className="info-comp-row">
                {comps}
            </div>
        )
    }
}

class Info extends React.Component {
    render() {
        var evalRows = {};
        for (const [i, m] of metrics.entries()) {
            const data = this.props.hexMap.getHappyValues(m);
            evalRows[m] = (
                <Histogram
                    key={i}
                    values={data.values}
                    planets={data.planets}
                    maxVal={data.max}
                    header={m}
                    landscape={this.props.landscape}
                    info={true}
                />
            );
        }

        var mapStringLetters = [];
        for (const [i, s] of sectorList.entries()) {
            mapStringLetters.push(
                <div key={i} className="info-mapgrid-table-col">
                    <div className="info-mapgrid-table-element">
                        {sectorName[i]}
                    </div>
                    <div className="info-mapgrid-table-element">
                        {sectorToLetter[s]}
                    </div>
                </div>
            );
        }

        return (
            <div className="info-box">
                <h1>
                    Gaia Map Database, Editor and Evaluator
                </h1>
                <p>Welcome!</p>
                This page explains the various buttons and information that you can find here.
                
                <h2> The Main Menu </h2>

                <InfoElement imgRef="Cog">
                    Click the cog symbol to open the map settings menu (described later).
                </InfoElement>

                <InfoElement imgRef="Stats">
                    Click the histogram symbol to show the evaluation of the current map (described later).
                </InfoElement>

                <InfoElement imgRef="pBalance">
                    Click the balance symbol to get a random map from a database of pregenerated maps. The pregenerated maps have been generated using an algorithm that tries to balance the map. The map will fit the settings you selected in the settings menu, however it will ignore the Random With Swap option if it is set to No (i.e. for the new map the sectors will be swaped around as well as rotated). <b>NOTE:</b> We are currently filling up the database with maps, and for some settings there are no maps yet.
                </InfoElement>

                <InfoElement imgRef="Random">
                    Click the randomize button to get a random map (no balancing algorithm used here). The map will fit the settings you selected in the settings menu. <b>WARNING:</b> if you select the most strict settings it is very hard to find a map that matches those settings. The randomize-button will give up after a while if it does not find a map. The web-page will be unresponsive while looking for a map.
                </InfoElement>

                <InfoElement imgRef="Rot">
                    When this is selected you can click on a sector to rotate it.
                </InfoElement>

                <InfoElement imgRef="Swap">
                    When this is selected you can click on one sector, then on another, to swap those sectors.
                </InfoElement>
                <InfoElement imgRef="Info">
                    You clicked this button to display this page. Click it again to show the map.
                </InfoElement>

                <h2> The Settings Menu </h2>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <NumSectorSelect
                            onClick={(numSec) => this.props.onClick(numSec)}
                            onClickVar={(variant) => this.props.onClickOpt(variant)}
                            menuSelect={this.props.menuSelect}
                        />
                    </div>
                    <div className="info-txt">
                        <p>
                            Select number of sectors for your map
                        </p>
                        <p>
                            For 7 and for 9 sectors there are more than one way you can select which sectors you use. Each variant will have the same number of planets for each color, but it might have a different number of Gaia planets or Transdim planets.
                        </p>
                        <p>
                            Click the menu above to see what sectors are used for the various variants below:
                        </p>
                    </div>
                    <SectorInfo sectors={getSecOpt(this.props.menuSelect.numSec, this.props.menuSelect.secOpt)} />
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <SelectOptionFromList
                            optName={settingOpts.playerCount.text}
                            opts={settingOpts.playerCount.optsView}
                            selectedOptIndex={this.props.menuSelect.playerCount}
                            onClickOpt={(opt) => this.props.onClickPlayerCount(opt)}
                        />
                    </div>
                    <div className="info-txt">
                        <p>
                            Select number of players. Note that this only has an effect on the number of passing boosters that used in the setup-generation, and it will not effect the number of sectors used in the map. We let you chose number of sectors however you like. If you feel like it you could after all play 2 players on a 10-sector map.
                        </p>
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <SelectOptionFromList
                            optName={settingOpts.rngWithSwap.text}
                            opts={settingOpts.rngWithSwap.optsView}
                            selectedOptIndex={this.props.menuSelect.rngWithSwap}
                            onClickOpt={(rngOpt) => this.props.onClickRngSwap(rngOpt)}
                        />
                    </div>
                    <div className="info-txt">
                        If the randomize button should swap the sectors positions, or only rotate the sectors.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <SelectOptionFromList
                            optName={settingOpts.minEqDist.text}
                            opts={settingOpts.minEqDist.optsView}
                            selectedOptIndex={this.props.menuSelect.minEqDist}
                            onClickOpt={(minEqDist) => this.props.onClickMinEqualDist(minEqDist)}
                        />
                    </div>
                    <div className="info-txt">
                        Distance allowed between two planets of the same color.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <SelectOptionFromList
                            optName={settingOpts.maxClustSize.text}
                            opts={settingOpts.maxClustSize.optsView}
                            selectedOptIndex={this.props.menuSelect.maxCluster}
                            onClickOpt={(clustOpt) => this.props.onClickClustOpt(clustOpt)}
                        />
                    </div>
                    <div className="info-txt">
                        Size of the largest cluster in the map.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <MapDbInfo
                            mapData={this.props.mapData}
                            menuSelect={this.props.menuSelect}
                        />
                    </div>
                    <div className="info-txt">
                        This show how many maps in the database fit the given settings.
                    </div>
                </InfoElement>

                <h2> The Map Evaluation </h2>
                An evaluation is always performed for the current map. Note that the evaluation is just an indicator, and not an absolute fact. We are constantly trying to improve the evaluation algorithm.

                <h3>Invalid Map Indication</h3>
                If the map is invalid according to the criteria given in the settins menu two things will happen:
                <div>1: The background of the page turns red</div>
                <div>2: The planets that break a criteria will be marked</div>
                <InfoElement imgRef="RedGlowyMark" imgClass="info-hex-mark-img">
                    Planets of the same color that are too close to each other are marked red.
                </InfoElement >
                <InfoElement imgRef="YellowMark" imgClass="info-hex-mark-img">
                    Planets in a cluster that is too large are marked yellow, or the planets in the largest cluster is marked yellow when the largest cluster is too small for the wanted cluster size.
                </InfoElement >

                <h3>Histograms</h3>
                <InfoElement imgRef="none">
                    <div className="info-menu">
                        {evalRows["Exp"]}
                    </div>
                    <div className="info-txt">
                        Each planet type get a score for how easy it is to expand from their home planets.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        {evalRows["Leech"]}
                    </div>
                    <div className="info-txt">
                        Each planet type get a score for planets nearby that can provide leech. The score take into account that it is better to get leech from a planet on the other side of the color wheel.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        {evalRows["EdgSad"]}
                    </div>
                    <div className="info-txt">
                        Each planet type get a negative score for each planet they have close to the edge of the map.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        {evalRows["Happy"]}
                    </div>
                    <div className="info-txt">
                        The total score is the sum of the other scores (negative scores are subtracted).
                    </div>
                </InfoElement>

                <h2>The Setup (below the map)</h2>

                <InfoElement imgRef="none">
                    <MapString mapString={"Map: " + this.props.mapString} />
                    <div className="info-menu">
                        <StringInput
                            onStringSubmit={(event) => this.props.onMapStringSubmit(event)}
                            onStringChange={(value) => this.props.onMapStringChange(value)}
                            textString={this.props.editMapString}
                            errorMsg={this.props.errorMsgMap}
                            description="Import map from string:"
                        />
                    </div>
                    <div className="info-txt">
                        <p>
                            Each map can be identified by a unique map string. The string for the current map is always displayd under the map. If you enter a map string into this text box and click Import the page will display the map for that map string.
                        </p>
                        <p>
                            The map string is created using 11 pairs of letters and numbers, where the letter represents a sector and the number represents the rotation of that sector. For example B2 is sector 1 rotated two times clockwise. This means that the possible rotations are 0 to 5. The position in the string is used to indicate the position of the sector in the following grid:
                        </p>

                        <p>
                            <img
                                className="info-mapgrid-img"
                                src={images["MapGrid"]}
                                alt="MapGrid"
                            />
                        </p>
                        <p>
                            The letters used for each sector is:
                            <div className="info-mapgrid-table">
                                {mapStringLetters}
                            </div>
                        </p>
                        <p>
                            The Map String for the default map is: A0N0B0F0M0C0D0H0L0E0J0
                        </p>
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <SetupString setupString={"Setup: " + this.props.setupString} />
                    <div className="info-menu">
                        <StringInput
                            onStringSubmit={(event) => this.props.onSetupStringSubmit(event)}
                            onStringChange={(value) => this.props.onSetupStringChange(value)}
                            textString={this.props.editSetupString}
                            errorMsg={this.props.errorMsgSetup}
                            description="Import setup from string:"
                        />
                    </div>
                    <div className="info-txt">
                        <p>
                            As for the map, the setup can be identified by a unique string. The string for the current setup is always displayd at the bottom of the setup. If you enter a setup string into this text box and click Import the page will display the setup for that setup string.
                        </p>
                        <p>
                            The setup string is created using 26-28 letters, where each letter represents a component, and the position in the string is used to indicate where that component is placed, like this:
                            <table CELLSPACING="0" >
                                <tr>
                                    <th>Position</th>
                                    <th>Usage</th>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>The federation that is placed at top of the terraforming track.</td>
                                </tr>
                                <tr>
                                    <td>2-7</td>
                                    <td>The advanced technologies that are placed at the top of the tracks, from terraforming at position 2 to science at position 7.</td>
                                </tr>
                                <tr>
                                    <td>8-13</td>
                                    <td>The base technologies that are placed at the bottom of the tracks, from terraforming at position 8 to science at position 13.</td>
                                </tr>
                                <tr>
                                    <td>14-19</td>
                                    <td>The round scoring tiles, from round 1 at position 14 to round 6 at position 19.</td>
                                </tr>
                                <tr>
                                    <td>20-21</td>
                                    <td>The end scoring tiles that are used.</td>
                                </tr>
                                <tr>
                                    <td>22-x</td>
                                    <td>The passing boosters that are used. It will depend on player count how many there is in the game. 2 players: x=26. 3 players: x=27. 4 players: x=28.</td>
                                </tr>
                            </table>
                        </p>

                        <p>
                            The letters used for the various components are:
                            <div className="info-comp-table">
                                <CompInfo components={fedToLetter} />
                                <CompInfo components={advTechToLetter} />
                                <CompInfo components={baseTechToLetter} />
                                <CompInfo components={roundVpToLetter} />
                                <CompInfo components={endVpToLetter} />
                                <CompInfo components={boosterToLetter} />
                            </div>
                        </p>
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <button className="setup-rng-btn" onClick={() => this.props.onClickRandomSetup()}>
                            Randomize Setup
                        </button>
                    </div>
                    <div className="info-txt">
                        Click this button to randomize the setup. It randomizes technologies, scoring tiles, etc, but not the map.
                    </div>
                </InfoElement>

            </div>
        )
    }
}

export default Info;
