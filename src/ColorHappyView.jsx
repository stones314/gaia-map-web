import React from 'react';
import { images, metrics, colorWheel } from './Defs';
import './styles/App.css';

const header = {
    "Happy": "Total",
    "Exp": "Expansion",
    "Leech": "Leech",
    "EdgSad": "Edge",
    "Central": "Central",
}

export class Histogram extends React.Component {

    render() {
        var cols = [];
        const myMax = this.props.maxVal;
        for (const [i, value] of this.props.values.entries()) {
            var rowClass = "happy-col";
            var color = "green";
            if (this.props.header === "EdgSad") {
                rowClass += "-down";
                color = "red";
            }
            var width = "100%";
            var height = "" + value * 100 / myMax + "%";
            var ta = "center";
            if (i < 7) {
                const planet = this.props.planets[i];
                const myStyle = {
                    width: width,
                    backgroundColor: color,
                    border: "1px solid black",
                    height: height,
                    textAlign: ta,
                }
                var v = value.toFixed(1);
                if (this.props.header === "Happy") {
                    cols.push(<div key={planet} className={rowClass}>
                        <div style={myStyle}>
                            {}
                        </div>
                    </div>);
                }
                else {
                    cols.push(<div key={planet} className={rowClass}>
                        <div style={myStyle}>
                            {}
                        </div>
                    </div>);
                }
            }
        }
        return (
            <div className="happy-box">
                <div className="happy-row-head">
                    {header[this.props.header]}
                </div>
                <div className="happy-row">
                    {cols}
                </div>
            </div>
        );
    }
}

class ColorHappyView extends React.Component {
    render() {
        var rows = [];
        for (const [i, m] of metrics.entries()) {
            const data = this.props.hexMap.getHappyValues(m);
            rows.push(
                <Histogram
                    key={i}
                    values={data.values}
                    planets={data.planets}
                    maxVal={data.max}
                    header={m}
                    landscape={this.props.landscape}
                />
            );
        }
        var imgs = [];
        for (const [i, planet] of colorWheel.entries()) {
            imgs.push(<div key={i} className="happy-col">
                <img src={images["p" + planet]} className="happy-img" alt={planet} />
                </div>
            );
        }
        return (
            <div className="happy-big-box">
                <div className="happy-planet-row">
                    {imgs}
                </div>
                <div className="happy-hist">
                    {rows}
                </div>
            </div>
        );
    }
}

export default ColorHappyView;