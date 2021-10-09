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
import Settings from './Settings';

function getSecOpt(numSec, optNum) {
    /*
        6 sector options:
          type 0: 1, 2, 3, 4, 9, 10
        7 sector options:
          type 0: 1, 2, 3, 4, 5_, 6_, 7_
          type 1: 1, 2, 3, 5_, 6, 7, 8
          type 2: 2, 4, 5, 6, 7_, 8, 10
          type 3: 1, 3, 4, 5, 6_, 7, 9
          type 4: 1, 3, 4, 5, 7_, 9, 10
          type 5: random between 0-4
        8 sector options:
          type 0: 1, 2, 3, 4, 5, 6, 7, 8
        9 sector options:
          type 0: 1, 2, 3, 4, 5_, 6_, 7_, 9, 10
          type 1: 1, 2, 3, 5_, 6, 7, 8, 9, 10
          type 2: random between type 0-1
        10 sector options:
          type 0: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    */
    if (numSec == 7) {
        var opt = optNum;
        if (opt < 0 || opt > 4)
            opt = Math.floor(5.0 * Math.random());
        if (opt === 0)
            return [s01, s02, s03, s04, s05b, s06b, s07b];
        if (opt === 1)
            return [s01, s02, s03, s05b, s06, s07, s08];
        if (opt === 2)
            return [s02, s04, s05, s06, s07b, s08, s10];
        if (opt === 3)
            return [s01, s03, s04, s05, s06b, s07, s09];
        if (opt === 4)
            return [s01, s03, s04, s05, s07b, s09, s10];
    }
    if (numSec == 8) {
        return [s01, s02, s03, s04, s05, s06, s07, s08];
    }
    if (numSec == 9) {
        var opt = optNum;
        if (opt < 0 || opt > 1)
            opt = Math.floor(2.0 * Math.random());
        if (opt === 0)
            return [s01, s02, s03, s04, s05b, s06b, s07b, s09, s10];
        if (opt === 1)
            return [s01, s02, s03, s05b, s06, s07, s08, s09, s10];
    }
    return [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10];
}

class EditVsSettings extends React.Component {
    render() {
        var editMapClass = "menu-mode-btn";
        var settingClass = "menu-mode-btn";
        if (this.props.showSettings)
            settingClass += " menu-mode-sel";
        else
            editMapClass += " menu-mode-sel";
        return (
                <div className="menu-row">
                    <button className={editMapClass} onClick={this.props.onClickEditMap}>
                        Edit Map
                    </button>
                    <button className={settingClass} onClick={this.props.onClickSettings}>
                        Settings
                    </button>
                </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettings: false,
            sectors: [s10, s01, s05, s09, s02, s03, s06, s08, s04, s07],
            rotation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            selected: -1,
            numSect: 10,
            swapMode: true,
            secOpt: 0,
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

    onClickSettings() {
        if (!this.state.showSettings)
            this.setState({ showSettings: true });
    }

    onClickEditMap() {
        if (this.state.showSettings)
            this.setState({ showSettings: false });
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
        this.setState({ numSect: 10, sectors: getSecOpt(10, 0), secOpt: 0 });
    }

    onClick9() {
        this.setState({ numSect: 9, sectors: getSecOpt(9, 0), secOpt: 0 });
    }
    onClick8() {
        this.setState({ numSect: 8, sectors: getSecOpt(8, 0), secOpt: 0 });
    }
    onClick7() {
        this.setState({ numSect: 7, sectors: getSecOpt(7, 0), secOpt: 0 });
    }

    onClickOpt0() {
        this.setState({ secOpt: 0, sectors: getSecOpt(this.state.numSect, 0) });
    }
    onClickOpt1() {
        this.setState({ secOpt: 1, sectors: getSecOpt(this.state.numSect, 1) });
    }
    onClickOpt2() {
        this.setState({ secOpt: 2, sectors: getSecOpt(this.state.numSect, 2) });
    }
    onClickOpt3() {
        this.setState({ secOpt: 3, sectors: getSecOpt(this.state.numSect, 3) });
    }
    onClickOpt4() {
        this.setState({ secOpt: 4, sectors: getSecOpt(this.state.numSect, 4) });
    }

    renderMenu() {
        if (this.state.showSettings) {
            return (
                <Settings />
            );
        }
        else {
            return (
                <Menu
                    onClickSwap={() => this.onClickSwap()}
                    onClickRot={() => this.onClickRot()}
                    swapMode={this.state.swapMode}
                    onClick10={() => this.onClick10()}
                    onClick9={() => this.onClick9()}
                    onClick8={() => this.onClick8()}
                    onClick7={() => this.onClick7()}
                    numSec={this.state.numSect}
                    onClickOpt0={() => this.onClickOpt0()}
                    onClickOpt1={() => this.onClickOpt1()}
                    onClickOpt2={() => this.onClickOpt2()}
                    onClickOpt3={() => this.onClickOpt3()}
                    onClickOpt4={() => this.onClickOpt4()}
                    secOpt={this.state.secOpt}
                />
            );
        }
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
                <div className="menu-box">
                    <EditVsSettings
                        onClickSettings={() => this.onClickSettings()}
                        onClickEditMap={() => this.onClickEditMap()}
                        showSettings={this.state.showSettings}
                    />
                    {this.renderMenu()}
                </div>
            </div>
        )
    }
}

export default App;
