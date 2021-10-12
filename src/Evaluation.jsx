import React from 'react';
import './Menu.css';
import './Evaluation.css';

class PlanetStats extends React.Component {

    render() {
        return (
            <div className="planet-box">
                <div className="planet-type">
                    <text className="stat-txt">{this.props.planet}</text>
                </div>
                <div className="planet-stats">
                    <div className="stat-lbl">
                        <text className="stat-txt">{this.props.exp}</text>
                    </div>
                    <div className="stat-lbl">
                        <text className="stat-txt">{this.props.nbr}</text>
                    </div>
                    <div className="stat-lbl">
                        <text className="stat-txt">{this.props.tot}</text>
                    </div>
                </div>
            </div>
        )
    }
}

class Evaluation extends React.Component {
    render() {
        const planets = ["Stats", "Blue", "Red", "Orange", "Yellow", "Brown", "Black", "White"];
        const expand = ["E", 14, 13, 12, 11, 10, 9, 8];
        const neighbour = ["N", 13, 12, 11, 10, 8, 7, 5];
        const planetData = [];
        for (const [index, value] of planets.entries()) {
            var total = "T";
            if (index > 0) total = expand[index] + neighbour[index];
            planetData.push(
                <PlanetStats
                    key={index}
                    planet={value}
                    exp={expand[index]}
                    nbr={neighbour[index]}
                    tot={total}
                />);
        }
        return (
            <div className="eval-box">
                {planetData}
            </div>
        )
    }
}

export default Evaluation;
