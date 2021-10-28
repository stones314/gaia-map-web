import React from 'react';
import { images } from './Defs';
import './styles/App.css';
class ColorHappyView extends React.Component {
    render() {
        var rows = [];
        rows.push(<div key="Head" className="happy-row">
            Happiness
            </div>);
        for (const [i, [planet, happy]] of this.props.colorHappy.entries()) {
            var rowClass = "happy-row";
            if (i < 7 && i > 6 - this.props.ignoredNum)
                rowClass += " ignored";
            if (i < 7) {
                rows.push(<div key={planet} className={rowClass}>
                    <img src={images["p" + planet]} className="happy-img" alt={planet} />
                    <div>
                        {" : " + happy + "%"}
                    </div>
                </div>);
            } else {
                rows.push(<div key={planet} className={rowClass}>
                    <div>{planet}</div>
                    <div>
                        {" : " + happy + "%"}
                    </div>
                </div>);
            }
        }
        return (<div className="happy-box">
            {rows}
        </div>);
    }
}

export default ColorHappyView;