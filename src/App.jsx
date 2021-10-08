import React from 'react';
import './App.css';
import s01 from './img/s01.png';
import s02 from './img/s02.png';
import s03 from './img/s03.png';
import s04 from './img/s04.png';
import s05 from './img/s05.png';
import s06 from './img/s06.png';
import s07 from './img/s07.png';
import s08 from './img/s08.png';
import s09 from './img/s09.png';
import s10 from './img/s10.png';
import s05b from './img/s05b.png';
import s06b from './img/s06b.png';
import s07b from './img/s07b.png';
import Map from './Map';
import Menu from './Menu';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectors: [s10, s01, s05, s09, s02, s03, s06, s08, s04, s07],
            rotation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            selected: -1,
            numSect: 10,
            swapMode: true,
        };
        this.onClickSector = this.onClickSector.bind(this);
        //this.onClickModeBtn = this.onClickModeBtn.bind(this);
    }

    onClickSector(i) {
        var rot = this.state.rotation.slice();
        if (this.state.swapMode) {
            if (this.state.selected < 0) {
                this.setState({ selected: i });
            } else if (this.state.selected === i) {
                this.setState({ selected: -1 });
            } else {
                var sec = this.state.sectors.slice();
                [sec[i], sec[this.state.selected]] = [sec[this.state.selected], sec[i]];
                [rot[i], rot[this.state.selected]] = [rot[this.state.selected], rot[i]];
                this.setState({ selected: -1, sectors: sec, rotation: rot });
            }
        }
        else {
            rot = this.state.rotation.slice();
            if (rot[i] === 300) {
                rot[i] = 0;
                this.setState({ rotation: rot });
            }
            else {
                rot[i] = rot[i] + 60;
                this.setState({ rotation: rot });
            }
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

    onClick10() {
        this.setState({ numSect: 10 });
    }

    onClick9() {
        this.setState({ numSect: 9 });
    }
    onClick8() {
        this.setState({ numSect: 8 });
    }
    onClick7() {
        this.setState({ numSect: 7 });
    }

    render() {
        return (
            <div className="App">
                <Map
                    numSect={this.state.numSect}
                    sectors={this.state.sectors}
                    rotation={this.state.rotation}
                    onClick={(i) => this.onClickSector(i)}
                    selected={this.state.selected}
                />
                <Menu
                    onClickSwap={() => this.onClickSwap()}
                    onClickRot={() => this.onClickRot()}
                    swapMode={this.state.swapMode}
                    onClick10={() => this.onClick10()}
                    onClick9={() => this.onClick9()}
                    onClick8={() => this.onClick8()}
                    onClick7={() => this.onClick7()}
                    numSec={this.state.numSect}

                />
            </div>
        )
    }
}

export default App;
