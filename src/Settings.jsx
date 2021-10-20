import React from 'react';
import './Menu.css';

class SelectOptionFromList extends React.Component {

    render() {
        var nOpt = this.props.opts.length;
        var optClass = new Array(nOpt).fill("menu-mode-btn");
        optClass[this.props.selectedOptIndex] += " menu-mode-sel";

        var rows = [];
        for (const [index, value] of this.props.opts.entries()) {
            rows.push(
                <button key={index} className={optClass[index]} onClick={() => this.props.onClickOpt(value)}>
                    {value}
                </button>
            );
        }
        return (
            <div>
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

class Settings extends React.Component {
    render() {
        return (
            <div className="menu-box-2">
                <SelectOptionFromList
                    optName="Min Equal Range"
                    opts={[2,3]}
                    selectedOptIndex={this.props.minEqDist - 2}
                    onClickOpt={(minEqDist) => this.props.onClickMinEqualDist(minEqDist)}
                />
                <SelectOptionFromList
                    optName="Random with swap"
                    opts={["Yes", "No"]}
                    selectedOptIndex={this.props.rngWithSwap ? 0 : 1}
                    onClickOpt={(doSwap) => this.props.onClickRngSwap(doSwap)}
                />
            </div>
        )
    }
}

export default Settings;
