import React from 'react';
import './App.css';
import MapView from './Map';
import Menu from './Menu';
import Settings from './Settings';
import Evaluation from './Evaluation';
import { Map, getSecOpt, getSectorArray } from './Defs';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectors: getSecOpt(10, 0),
            rotations: [0,0,0,0,0,0,0,0,0,0,0,0],
            selected: -1,
            swapMode: true,
            numSect: 10,
            secOpt: 0,
        };
        this.onClickSector = this.onClickSector.bind(this);
        //this.onClickModeBtn = this.onClickModeBtn.bind(this);
    }

    onClickSector(i) {
        var rot = this.state.rotations.slice();
        if (this.state.swapMode) {
            if (this.state.selected < 0) {
                this.setState({ selected: i});
            } else if (this.state.selected === i) {
                this.setState({ selected: -1 });
            } else {
                var sec = this.state.sectors.slice();
                [sec[i], sec[this.state.selected]] = [sec[this.state.selected], sec[i]];
                [rot[i], rot[this.state.selected]] = [rot[this.state.selected], rot[i]];
                this.setState({ selected: -1, sectors: sec, rotations: rot });
            }
        }
        else {
            rot[i] = (rot[i] + 60) % 360;
            this.setState({ rotations: rot });
        }
    }

    onClickSwap() {
        if (!this.state.swapMode)
            this.setState({ swapMode: true });
    }

    onClickRot() {
        if (this.state.swapMode)
            this.setState({ swapMode: false });
    }

    onClick(numSec) {
        this.setState({ numSect: numSec, sectors: getSecOpt(numSec, 0), secOpt: 0 });
    }

    onClickOpt(variant) {
        this.setState({ secOpt: variant, sectors: getSecOpt(this.state.numSect, variant) });
    }

    render() {
        return (
            <div className="App">
                <div className="map-eval-box">
                    <MapView
                        numSect={this.state.numSect}
                        sectors={this.state.sectors}
                        rotation={this.state.rotations}
                        onClick={(i) => this.onClickSector(i)}
                        selected={this.state.selected}
                    />
                    <Evaluation />
                </div>
                <div className="menu-box">
                    <Menu
                        onClickSwap={() => this.onClickSwap()}
                        onClickRot={() => this.onClickRot()}
                        swapMode={this.state.swapMode}
                        onClick={(numSec) => this.onClick(numSec)}
                        numSec={this.state.numSect}
                        onClickOpt={(variant) => this.onClickOpt(variant)}
                        secOpt={this.state.secOpt}
                    />
                    <Settings />
                </div>
            </div>
        )
    }
}

export default App;
