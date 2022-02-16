import React from 'react';
import { edgeOpts, clustOpts, settingOpts } from './Defs';
import './styles/Menu.css';

export class SelectOptionFromList extends React.Component {

    render() {
        var nOpt = this.props.opts.length;
        var optClass = new Array(nOpt).fill("menu-mode-btn");
        optClass[this.props.selectedOptIndex] += " menu-mode-sel";

        var rows = [];
        for (const [index, value] of this.props.opts.entries()) {
            rows.push(
                <button key={index} className={optClass[index]} onClick={() => this.props.onClickOpt(index)}>
                    {value}
                </button>
            );
        }
        return (
            <div className="menu-item">
                <div className="menu-row">
                    <div className="menu-mode-lbl">
                        {this.props.optName}
                    </div>
                </div>
                <div className="menu-row">
                    {rows}
                </div>
            </div>
        );
    }
}

export class Settings extends React.Component {
    render() {
        return (
            <div className="menu-box-2">
                <SelectOptionFromList
                    optName={settingOpts.playerCount.text}
                    opts={settingOpts.playerCount.optsView}
                    selectedOptIndex={this.props.menuSelect.playerCount}
                    onClickOpt={(numPlayers) => this.props.onClickPlayerCount(numPlayers)}
                />
                <SelectOptionFromList
                    optName={settingOpts.rngWithSwap.text}
                    opts={settingOpts.rngWithSwap.optsView}
                    selectedOptIndex={this.props.menuSelect.rngWithSwap}
                    onClickOpt={(rngOpt) => this.props.onClickRngSwap(rngOpt)}
                />
                <SelectOptionFromList
                    optName={settingOpts.minEqDist.text}
                    opts={settingOpts.minEqDist.optsView}
                    selectedOptIndex={this.props.menuSelect.minEqDist}
                    onClickOpt={(minEqDist) => this.props.onClickMinEqualDist(minEqDist)}
                />
                <SelectOptionFromList
                    optName={settingOpts.maxClustSize.text}
                    opts={settingOpts.maxClustSize.optsView}
                    selectedOptIndex={this.props.menuSelect.maxCluster}
                    onClickOpt={(clustOpt) => this.props.onClickClustOpt(clustOpt)}
                />
            </div>
        )
    }
}

export default Settings;
