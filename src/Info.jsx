import React from 'react';
import './styles/Menu.css';
import { Settings, SelectOptionFromList } from './Settings';
import { settingOpts, images } from './Defs'

class InfoElement extends React.Component {
    render() {
        return (
            <div className="info-element">
                <div className="img-btn">
                    <img
                        className="info-img"
                        src={images[this.props.imgRef]}
                        alt={this.props.imgRef}
                    />
                </div>
                <div>
                    {this.props.text}
                </div>
            </div>
            );
    }
}

class Info extends React.Component {
    render() {
        return (
            <div className="info-box">
                <h1>
                    Gaia Map Generator, Editor and Evaluator
                </h1>
                Welcome! Since my UI desing skills are terrible I added this page so that I can explain how the map generator works.
                
                <h2> The Main Menu </h2>

                <InfoElement
                    imgRef="Cog"
                    text="Click the cog symbol to open the map settings menu (described later)."
                />
                <InfoElement
                    imgRef="Stats"
                    text="Click the histogram symbol to show the evaluation of the current map (described later)."
                />
                <InfoElement
                    imgRef="pBalance"
                    text="NOTE: Not yet implemented. For now behaves the same as the Randomize button (bellow). When implemented you can Click the balance symbol to get a random map from a database of pregenerated balanced maps. The map will fit the settings you selected in the settings menu, however it will ignore the Random With Swap option if it is set to No (i.e. for the new map the sectors will be swaped around as well as rotated)."
                />
                <InfoElement
                    imgRef="Random"
                    text="Click the randomize button to get a random map (no balancing algorithm used here). The map will fit the settings you selected in the settings menu."
                />
                <InfoElement
                    imgRef="Rot"
                    text="When this is selected you can click on a sector to rotate it."
                />
                <InfoElement
                    imgRef="Swap"
                    text="When this is selected you can click on one sector, then on another, to swap those sectors."
                />
                <InfoElement
                    imgRef="Info"
                    text="You clicked this button to display this page. Click it again to show the map."
                />

                <h2> The Settings Menu </h2>

                <h3>Number of Sectors</h3>
                Select number of sectors for your map

                <h3>Variant</h3>
                For 7 and for 9 sectors there are more than one way you can select which sectors you use. Each variant will have the same number of planets for each color, but it might have a different number of Gaia planets or Transdim planets. 

                <h3>Random With Swap</h3>
                If the randomize button should swap the sectors positions, or only rotate the sectors.

                <h3>Min Equal Range</h3>
                Minimum distance that is allowed between two planets of the same color.

                <h3>Max Cluster Size</h3>
                Maximum number of planets that can be next to each other.

                <h3>Max Edge Planets</h3>
                Maximum number of planets a color can have on the edge of the map.

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
