import React from 'react';
import './styles/Setup.css';
import { images } from "./Defs";
import { getRemainingBaseTech } from './HelperFunctions';
import { StringInput } from './Menu';

class TechElement extends React.Component {
    renderImg(imgRef) {
        if (imgRef) {
            var imgClass = "tech-img";
            if (imgRef.slice(0, 3) === "FED")
                imgClass += "-fed";
            return (
                <img
                    className={imgClass}
                    src={images[this.props.imgRef]}
                    alt={this.props.imgRef}
                />
            );
        }
        return null;
    }

    render() {
        const cClass = [" tech-ter", " tech-nav", " tech-qic", " tech-gai", " tech-eco", " tech-sci", " tech-low"];
        return (
            <div className={"tech-element" + cClass[this.props.cId]}>
                {this.renderImg(this.props.imgRef)}
            </div>
        )
    }
}


class TechRow extends React.Component {
    render() {
        var elements = [];
        for (const [i, imgRef] of this.props.images.entries()) {
            const color = this.props.images.length != 3 ? i : 6;
            elements.push(<TechElement imgRef={imgRef} cId={color} key={i}/>);
        }
        return (
            <div className="tech-row">
                {elements}
            </div>
        )
    }

}

class TechView extends React.Component {

    render() {
        var row1 = this.props.setup.feds.slice(0, 1);
        for (var i = 0; i < 5; i++)
            row1.push("");
        return (
            <div className="tech-box">
                <TechRow images={row1} />
                <TechRow images={this.props.setup.advTech} />
                <TechRow images={this.props.setup.baseTech} />
                <TechRow images={getRemainingBaseTech(this.props.setup.baseTech)} />
            </div>
        )
    }
}

class RoundView extends React.Component {
    render() {
        var rounds = [];
        for (const [i, imgRef] of this.props.images.entries()) {
            rounds.push(
                <div key={i} className={"rnd"+i}>
                    <img
                        className="rnd-img"
                        src={images[imgRef]}
                        alt={imgRef}
                    />
                </div>
            );
        }
        return (
            <div className="rnd-box">
                {rounds}
            </div>
        );
    }
}

class BoosterView extends React.Component {
    render() {
        var boosts = [];
        for (const [i, imgRef] of this.props.images.entries()) {
            boosts.push(
                <div className="booster" key={i}>
                    <img
                        className="booster-img"
                        src={images[imgRef]}
                        alt={imgRef}

                    />
                </div>
            );
        }
        return (
            <div className="booster-box">
                {boosts}
            </div>
        );
    }
}

class EndVpView extends React.Component {
    render() {
        var endVps = [];
        for (const [i, imgRef] of this.props.images.entries()) {
            endVps.push(
                <div className="end" key={i}>
                    <img
                        className="end-img"
                        src={images[imgRef]}
                        alt={imgRef}

                    />
                </div>
            );
        }
        return (
            <div className="end-box">
                {endVps}
            </div>
        );
    }
}

export class SetupString extends React.Component {
    render() {
        return (
            <div className="map-string-box">
                <text className="map-string-txt">
                    {this.props.setupString}
                </text>
           </div>
        );
    }
}

class Setup extends React.Component {
    render() {
        return (
            <div className="setup-box">
                <StringInput
                    onStringSubmit={(event) => this.props.onMapStringSubmit(event)}
                    onStringChange={(value) => this.props.onMapStringChange(value)}
                    textString={this.props.mapString}
                    errorMsg={this.props.errorMsgMap}
                    description="Import map from string:"
                />
                <TechView setup={this.props.setup} />
                <RoundView images={this.props.setup.rounds} />
                <BoosterView images={this.props.setup.boosts} />
                <EndVpView images={this.props.setup.endVps} />
                <SetupString setupString={"Setup: " + this.props.setupString} />
                <StringInput
                    onStringSubmit={(event) => this.props.onSetupStringSubmit(event)}
                    onStringChange={(value) => this.props.onSetupStringChange(value)}
                    textString={this.props.editSetupString}
                    errorMsg={this.props.errorMsgSetup}
                    description="Import setup from string:"
                />
                <button className="setup-rng-btn" onClick={() => this.props.onClickRandomSetup()}>
                    Randomize Setup
                </button>
            </div>
        );
    }
}

export default Setup;
