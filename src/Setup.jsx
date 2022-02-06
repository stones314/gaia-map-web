import React from 'react';
import './styles/Setup.css';
import { images, advTech, baseTech, boosters, feds, roundVps, endVps } from "./Defs";

class TechElement extends React.Component {
    renderImg(imgRef) {
        if (imgRef) {
            return (
                <img
                    className="tech-img"
                    src={images[this.props.imgRef]}
                    alt={this.props.imgRef}
                />
            );
        }
        return null;
    }

    render() {
        const cClass = [" tech-ter", " tech-nav", " tech-qic", " tech-gai", " tech-eco", " tech-sci", ""];
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
        var row1 = this.props.setup.fed.slice(0, 1);
        for (var i = 0; i < 5; i++)
            row1.push("");
        return (
            <div className="tech-box">
                <TechRow images={row1} />
                <TechRow images={this.props.setup.advTech} />
                <TechRow images={this.props.setup.baseTech.slice(0, 6)} />
                <TechRow images={this.props.setup.baseTech.slice(6, 9)} />
            </div>
        )
    }
}


class Setup extends React.Component {
    render() {
        return null;
    }
}

export default TechView;
