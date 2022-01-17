import React from 'react';
import './styles/Menu.css';
import { Settings, SelectOptionFromList } from './Settings';
import { NumSectorSelect } from './Menu';
import { settingOpts, images, getSecOpt } from './Defs'

class InfoElement extends React.Component {

    renderImg() {
        if (this.props.imgRef === "none") return null;
        return (
            <div className="img-btn">
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


class Info extends React.Component {
    render() {
        return (
            <div className="info-box">
                <h1>
                    Gaia Map Database, Editor and Evaluator
                </h1>
                Welcome! Since my UI desing skills are terrible I added this page so that I can explain how the map generator works.
                
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
                            optName={settingOpts.rngWithSwap.text}
                            opts={settingOpts.rngWithSwap.optsView}
                            selectedOptIndex={0}
                            onClickOpt={(rngOpt) => null}
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
                            selectedOptIndex={0}
                            onClickOpt={(minEqDist) => null}
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
                            selectedOptIndex={0}
                            onClickOpt={(minEqDist) => null}
                        />
                    </div>
                    <div className="info-txt">
                        Size of the largest cluster in the map.
                    </div>
                </InfoElement>

                <InfoElement imgRef="none">
                    <div className="info-menu">
                        <SelectOptionFromList
                            optName={settingOpts.maxEdgeCount.text}
                            opts={settingOpts.maxEdgeCount.optsView}
                            selectedOptIndex={0}
                            onClickOpt={(minEqDist) => null}
                        />
                    </div>
                    <div className="info-txt">
                        How many planets a color may have at the very edge of the map.
                    </div>
                </InfoElement>

                <h2> The Map Evaluation </h2>

                <h3>Invalid Map Indication</h3>
                If the map is invalid according to the criteria above two things will happen:
                <div>1: The background of the page turns red</div>
                <div>2: The planets that break a criteria will be marked</div>

                <h3>Expansion Score</h3>
                Each planet type get a score for how easy it is to expand from their home planet.

                <h3>Leech Score</h3>
                Each planet type get a score for how likely they are to get leech at their home planet. It assumes that you are more likely to get leech from planets on the other side of the color-wheel.

                <h3>Edge Score</h3>
                Each planet type get a negative score for each planet they have close to the edge of the map.

                <h3>Total Score</h3>
                The total score is the sum of the other scores (negative scores are subtracted).
            </div>
        )
    }
}

export default Info;
