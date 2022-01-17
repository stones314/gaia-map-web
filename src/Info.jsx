import React from 'react';
import './styles/Menu.css';
import { Settings, SelectOptionFromList } from './Settings';
import { NumSectorSelect } from './Menu';
import { Histogram } from './ColorHappyView';
import { settingOpts, images, getSecOpt, metrics, colorWheel } from './Defs'

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
                        <SelectOptionFromList
                            optName={settingOpts.maxEdgeCount.text}
                            opts={settingOpts.maxEdgeCount.optsView}
                            selectedOptIndex={this.props.menuSelect.maxEdge}
                            onClickOpt={(edgeOpt) => this.props.onClickEdgeOpt(edgeOpt)}
                        />
                    </div>
                    <div className="info-txt">
                        How many planets a color may have at the very edge of the map.
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
                    Planets in a cluster that is too large are marked yellow.
                </InfoElement >
                <InfoElement imgRef="GrayMark" imgClass="info-hex-mark-img">
                    If a color has too many planets on the edge of the map they are marked grey.
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
            </div>
        )
    }
}

export default Info;
