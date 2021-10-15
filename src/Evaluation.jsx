import React from 'react';
import './Menu.css';
import './App.css';
import './Evaluation.css';
import { colorWheel } from './Evaluator';

class PlanetStats extends React.Component {

    render() {
        return (
            <div className="planet-box">
                <div className="planet-type">
                    <div className={"stat-txt hex-" + this.props.planet}>{this.props.planet}</div>
                </div>
                <div className="planet-stats">
                    <div className="stat-lbl">
                        <div className="stat-txt">{this.props.exp}</div>
                    </div>
                    <div className="stat-lbl">
                        <div className="stat-txt">{this.props.nbr}</div>
                    </div>
                    <div className="stat-lbl">
                        <div className="stat-txt">{this.props.tot}</div>
                    </div>
                </div>
            </div>
        )
    }
}

class Evaluation extends React.Component {
    render() {
        const planets = ["Stats"];
        const expand = ["Expand"];
        const neighbour = ["Leech"];
        const total = ["Total"];
        for (const [i, p] of colorWheel.entries()) {
            planets.push(p);
            expand.push(this.props.balance[p][0].toFixed(1));
            neighbour.push(this.props.balance[p][1].toFixed(1));
            total.push((this.props.balance[p][0] + this.props.balance[p][1]).toFixed(1));
        }
        const planetData = [];
        for (const [index, value] of planets.entries()) {
            planetData.push(
                <PlanetStats
                    key={index}
                    planet={value}
                    exp={expand[index]}
                    nbr={neighbour[index]}
                    tot={total[index]}
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
